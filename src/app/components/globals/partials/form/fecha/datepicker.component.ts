import { Component, OnInit, forwardRef, EventEmitter, Input, Output, Renderer,  ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Logger } from "@services/logger.service";

export const DATEPICKER_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatePicker),
    multi: true
};

@Component({
    selector: 'date-picker',
    templateUrl: './datepicker.component.html',
    providers: [DATEPICKER_CONTROL_VALUE_ACCESSOR],
    host: {
    '(document:click)': 'onClick($event)',
    }
})

export class DatePicker implements OnInit, ControlValueAccessor {

    @Input() settings: Settings;
    @Input() label : string = 'Seleccione una fecha';
    @Input() value : string;
    @Input() name  : string  = '';
    @Input() group : FormGroup = new FormGroup({});
    @Input() disabled: boolean=false;
    @Input() hintStart: string="";
    @Input() hintEnd: string="";
    @Input() sufix    : string;
    @Input() prefixIcon : string;
    @Input() sufixIcon : string;
    @Input() validateDays : string ="";
    @Output() onDateSelect:EventEmitter<Date> = new EventEmitter<Date>();

    selectedYear: any;
    selectedMonth: any;
    selectedDay:any;
    // @Output() valueChange:EventEmitter<string> = new EventEmitter<String>();

    @ViewChild('datePicker') datePicker;

    public control: FormControl;

    selectedDate: String;
    date: Date;
    popover: Boolean = false;
    
    cal_days_in_month:Array<any> = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];    
    timeViewDate:Date = new Date(this.date);
    hourValue:number = 0;
    minValue:number = 0;
    timeViewMeridian:string = "";
    timeView:boolean = false;
    yearView: Boolean = false;
    yearsList:Array<any> = [];
    monthDays: Array<any> = [];
    monthsView:boolean = false;
    today:Date = new Date();
    monthVal = {'ENE':0, 'FEB':1, 'MAR':2, 'ABR':3, 'MAY':4, 'JUN':5, 'JUL':6, 'AGO':7, 'SEP':8, 'OCT':9, 'NOV':10, 'DIC':11}
    
    defaultSettings: Settings = {
        defaultOpen: false,
        bigBanner: true,
        timePicker: false,
        format: 'dd-MMM-yyyy',
        cal_days_labels: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
        cal_full_days_lables: ["Domingo","Lunes","Martes","Wednesday","Thursday","Friday","Saturday"],
        cal_months_labels: ['January', 'February', 'March', 'Abril',
                            'May', 'June', 'July', 'August', 'September',
                            'October', 'Noviembre', 'December'],
        cal_months_labels_short: ['ENE', 'FEB', 'MAR', 'ABR',
                                'MAY', 'JUN', 'JUL', 'AGO', 'SEP',
                                'OCT', 'NOV', 'DIC'],
        closeOnSelect: true
    }

    constructor(
        private renderer : Renderer,
        private elementRef : ElementRef
        ){
        this.selectedMonth = this.today.getMonth();
        this.selectedYear  = this.today.getFullYear();
    }

    ngOnInit(){
        this.settings = Object.assign(this.defaultSettings, this.settings);
        this.writeValue(new Date());
        if(this.settings.defaultOpen){
            this.popover = true;
        }

        this.group.controls[this.name].valueChanges.subscribe(
            data => {
                // Logger.log('Change DatePicker value', data);
            }
        )

        this.control = this.group.get(this.name)  as FormControl;
        this.control.valueChanges.subscribe(val => {
            Logger.log('Date valueChanges()', val);
            if(val != null && val != 'Invalid Date'){
                this.date = new Date(val);
                this.onDateSelect.emit(this.date);
            }
        });
    }

    ngAfterViewInit(){
        this.renderer.listen(
            this.datePicker.nativeElement, 'focus', event => this.popover = true);
    }

    cleanValue(){
        this.value = "";
        this.popover = false;
    }

    onClick(event) {
        if (event.target.parentElement != null) {
            if (!this.elementRef.nativeElement.contains(event.target) && event.target.parentElement.className != "years-list-view") 
                this.popover = false; 
        }
    }

    private onTouchedCallback: () =>  {};
    private onChangeCallback: (_: any) => {};
    writeValue(value: any) {
        if (value !== undefined && value !== null) {
            this.initDate(value);
        }
        else{
            this.date = new Date();
        }
        this.generateDays();
    }
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
   initDate(val:string){
        this.date = new Date(val);
        if(this.date.getHours() <= 11 ){
                    this.hourValue = this.date.getHours();
                    this.timeViewMeridian = "AM";
                }
                else{
                    this.hourValue = this.date.getHours() - 12;
                    this.timeViewMeridian = "PM";
                }
                if(this.date.getHours() == 0 || this.date.getHours() == 12){
                this.hourValue = 12;
            }
        this.minValue = this.date.getMinutes();
   }
   generateDays(){
       this.monthDays = [];
        var year = this.date.getFullYear(),
        month = this.date.getMonth(),
        current_day = this.date.getDate(),
        today = new Date();
        var firstDay = new Date(year, month, 1);
        var startingDay = firstDay.getDay();
        var monthLength = this.getMonthLength(month,year);
        var day = 1;
        var dateArr = [];
        var dateRow =[];
        // this loop is for is weeks (rows)
        for (var i = 0; i < 9; i++) {
            // this loop is for weekdays (cells)
            dateRow = [];
            for (var j = 0; j <= 6; j++) { 
                var dateCell = null;
            if (day <= monthLength && (i > 0 || j >= startingDay)) {
                dateCell = day;
            if(day == current_day){
               // dateCell.classList.add('selected-day');
            }
            if(day == this.today.getDate() &&  this.date.getMonth() == today.getMonth() &&  this.date.getFullYear() == today.getFullYear()){
               // dateCell.classList.add('today');
            }
                day++;
            }
            dateRow.push(dateCell);
            }
            // stop making rows if we've run out of days
            if (day > monthLength) {
                dateArr.push(dateRow);
            break;
            } else {
                dateArr.push(dateRow);
            }
    }
      this.monthDays = dateArr;
    }
    generateYearList(param:string){
        var startYear = null;
        var currentYear = null;
        if(param == "next"){
            startYear = this.yearsList[8] + 1;
            currentYear = this.date.getFullYear();
        }
        else if(param == "prev"){
            startYear = this.yearsList[0] - 9;
            currentYear = this.date.getFullYear();
        }
        else{
            currentYear = this.date.getFullYear();
            startYear = currentYear - 4;
            this.yearView = !this.yearView;
            this.monthsView = false;
        }
         for(var k=0; k< 9; k++){
                 this.yearsList[k] = startYear + k;
            }
    }
    getMonthLength(month:number,year:number){
        var monthLength = this.cal_days_in_month[month];
        
        // compensate for leap year
        if (month == 1) { // February only!
            if((year % 4 == 0 && year % 100 != 0) || year % 400 == 0){
            monthLength = 29;
            }
        }
        return monthLength;
    }
    toggleMonthView(){
        this.yearView = false;
        this.monthsView =  !this.monthsView;
    }
    toggleMeridian(val:string){
        this.timeViewMeridian = val;
    }
    setTimeView(){
        if(this.timeViewMeridian == "AM"){
            if(this.hourValue == 12){
                this.date.setHours(0);
            }
            else{
                this.date.setHours(this.hourValue);
            }
            this.date.setMinutes(this.minValue);
        }
        else{
            if(this.hourValue == 12){
                this.date.setHours(this.hourValue);
            }
            else{
                this.date.setHours(this.hourValue + 12);
            }
            this.date.setMinutes(this.minValue);
        }
        this.date = new Date(this.date);
        this.timeView = !this.timeView;
    }
    setDay(evt:any){
        var ydate = this.today.getMonth();
        var xdate = this.today.getFullYear();
        var xday = this.today.getDate();
        this.selectedDay = parseInt(evt.target.innerHTML);
        if (!this.selectedYear) {
            this.selectedYear = this.today.getFullYear();
        }
        if (!this.selectedMonth) {
            this.selectedMonth = this.today.getMonth();
        }
        if(evt.target.innerHTML && !isNaN(evt.target.innerHTML) ){
            if (this.validateDays == 'post') {
                if (this.selectedYear == xdate) {
                    if (this.selectedMonth == ydate) {
                        if (this.selectedDay <= xday) {
                            this.date = new Date(this.date.setDate(this.selectedDay));  
                            if(this.settings.closeOnSelect){
                                this.popover = false;
                                this.onDateSelect.emit(this.date);
                            }    
                        }            
                    }else if(this.selectedMonth < ydate){
                        this.date = new Date(this.date.setDate(this.selectedDay));  
                            if(this.settings.closeOnSelect){
                                this.popover = false;
                                this.onDateSelect.emit(this.date);
                            }    
                    }                    
                }else{
                    this.date = new Date(this.date.setDate(this.selectedDay));  
                        if(this.settings.closeOnSelect){
                            this.popover = false;
                            this.onDateSelect.emit(this.date);
                        }
                }        
            }else{
                this.date = new Date(this.date.setDate(this.selectedDay));  
                if(this.settings.closeOnSelect){
                    this.popover = false;
                    this.onDateSelect.emit(this.date);
                }                
          }  
        }
        this.group.controls[this.name].setValue(this.date);
    }
    setYear(evt:any){
        this.selectedYear = parseInt(evt.target.getAttribute('id'));
        var ydate = this.today.getFullYear();
        if(evt.target.innerHTML && !isNaN(evt.target.innerHTML) ){
            if (this.validateDays == 'post') {
                if (this.selectedYear <= ydate) {
                    this.date = new Date(this.date.setFullYear(this.selectedYear)); 
                    this.yearView = !this.yearView;
                    this.generateDays();
                }
            }else{
                this.date = new Date(this.date.setFullYear(this.selectedYear)); 
                this.yearView = !this.yearView;
                this.generateDays();
            }
        }    
    }
    setMonth(evt:any){
        this.selectedMonth = this.settings.cal_months_labels_short.indexOf(evt.target.getAttribute('id'));
        var ydate = this.today.getMonth();
        var xdate = this.today.getFullYear();

        if(evt.target.getAttribute('id')){
            if (this.validateDays == 'post') {
                if (this.selectedYear < xdate) {
                        this.date = new Date(this.date.setMonth(this.selectedMonth));
                        this.monthsView = !this.monthsView;
                        this.generateDays();    
                }else{
                    if (this.selectedMonth <= ydate) {
                        this.date = new Date(this.date.setMonth(this.selectedMonth));
                        this.monthsView = !this.monthsView;
                        this.generateDays();
                    }
                }
            }else{                
                this.date = new Date(this.date.setMonth(this.selectedMonth));
                this.monthsView = !this.monthsView;
                this.generateDays();
            }        
        }
    }
    prevMonth(e:any){
        e.stopPropagation();
        var self = this;
        if(this.date.getMonth() == 0){
            this.date.setMonth(11);
            this.date.setFullYear(this.date.getFullYear() - 1);
        }else{
            var prevmonthLength = this.getMonthLength(this.date.getMonth() - 1, this.date.getFullYear());
            var currentDate = this.date.getDate();
            if(currentDate > prevmonthLength ){
                this.date.setDate(prevmonthLength);
            }
            this.date.setMonth(this.date.getMonth() - 1);
        }
         this.date = new Date(this.date);
         this.generateDays();
    }
    nextMonth(e:any){
        e.stopPropagation();
        var self = this;
        if(this.date.getMonth() == 11){
            this.date.setMonth(0);
            this.date.setFullYear(this.date.getFullYear() + 1);
        }else{
            var nextmonthLength = this.getMonthLength(this.date.getMonth() + 1, this.date.getFullYear());
            var currentDate = this.date.getDate();
            if(currentDate > nextmonthLength){
                this.date.setDate(nextmonthLength);
            }
            this.date.setMonth(this.date.getMonth() + 1);
            
        }
        this.date = new Date(this.date);
        this.generateDays();
    }
    onChange(evt:any){
        Logger.log(evt);
    }
    incHour(){
        if(this.hourValue < 12){
            this.hourValue += 1;
            Logger.log(this.hourValue);
        } 
    }
    decHour(){
        if(this.hourValue > 1){
            this.hourValue -= 1;
            Logger.log(this.hourValue);
        } 
    }
    incMinutes(){
        if(this.minValue < 59){
            this.minValue += 1;
            Logger.log(this.minValue);
        } 
    }
    decMinutes(){
        if(this.minValue > 0){
            this.minValue -= 1;
            Logger.log(this.minValue);
        } 
    }
    done(){
       // this.onChangeCallback(this.date.toString());
       this.popover = false;
       this.onDateSelect.emit(this.date);
    }
}

export interface Settings{
    bigBanner?: Boolean;
    timePicker: Boolean;
    format: string;
    defaultOpen?: Boolean;
    cal_days_labels: Array<string>;
    cal_full_days_lables: Array<string>;
    cal_months_labels: Array<string>;
    cal_months_labels_short: Array<string>;
    closeOnSelect?: boolean;
}
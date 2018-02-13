/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["assets/css/bootstrap-grid.css","68dba5af0b67aa3883774411b3618c39"],["assets/css/material.indigo-pink.min.css","bc5bed91fc5535e8ff2c27b9ecd59063"],["assets/css/materialize.min.css","df8ee5622d9d736da06a6b0e7afdef55"],["assets/css/mdl/material.css","06f1e256dfe14286eb1dd63abe2953bb"],["assets/css/mdl/material.indigo-pink.min.css","bc5bed91fc5535e8ff2c27b9ecd59063"],["assets/css/mdl/material.min.css","9ab85b48144d24908b4e455c2afb648c"],["assets/fonts/roboto/Roboto-Bold.woff","eed9aab5449cc9c8430d7d258108f602"],["assets/fonts/roboto/Roboto-Bold.woff2","c0f1e4a4fdfb8048c72e86aadb2a247d"],["assets/fonts/roboto/Roboto-Light.woff","ea36cd9a0e9eee97012a67b8a4570d7b"],["assets/fonts/roboto/Roboto-Light.woff2","3c37aa69cd77e6a53a067170fa8fe2e9"],["assets/fonts/roboto/Roboto-Medium.woff","cf4d60bc0b1d4b2314085919a00e1724"],["assets/fonts/roboto/Roboto-Medium.woff2","1561b424aaef2f704bbd89155b3ce514"],["assets/fonts/roboto/Roboto-Regular.woff","3cf6adf61054c328b1b0ddcd8f9ce24d"],["assets/fonts/roboto/Roboto-Regular.woff2","5136cbe62a63604402f2fedb97f246f8"],["assets/fonts/roboto/Roboto-Thin.woff","44b78f142603eb69f593ed4002ed7a4a"],["assets/fonts/roboto/Roboto-Thin.woff2","1f35e6a11d27d2e10d28946d42332dc5"],["assets/formatos/F1-003 LECTURA DE DERECHOS DE LA VÍCTIMA.docx","f555251515b029542a7ad8ea4b59706e"],["assets/formatos/F1-004 REGISTRO PRESENCIAL.docx","873dc0d640bf248bafce9cc79836d90c"],["assets/formatos/F1-005 REGISTRO DE RECEPCIÓN DE LLAMADA.docx","667358159dd809d1d341280674504f07"],["assets/formatos/F1-008 ENTREVISTA.docx","1de7eec0112530276b271f1cca016179"],["assets/formatos/F1-009 OFICIO SOLICITUD A SERVICIOS PERICIALES.docx","eda097c42c36c4c1d473af2321a20512"],["assets/formatos/F1-010 SOLICITUD EXAMEN PSICOFÍSICO.docx","76ea430b69bc848a4579f40aab7b4b8c"],["assets/formatos/F1-011 OFICIO SOLICITUD A POLICIA MINISTERIAL.docx","33842512a9a87648e5789eb5c2a8b151"],["assets/formatos/F1-016 Y F1-015 FORMATO DE ACUERDO DE INICIO.docx","4d8e4973ef2fa386cd5fb7e36783c196"],["assets/formatos/F1-021 OFICIO SOLICITUD A POLICIA MINISTERIAL SIN APERCIBIMIENTO.docx","eabbb896e3228fd8db61bfeba0254576"],["assets/formatos/F1_003_Lectura_De_Derechos_De_La_Victima.docx","9e9f81f15bb0b81c1720db3010b97e15"],["assets/formatos/F1_004_Registro_Presencial.docx","55eadf56fc49d93880d168f27b89d9ee"],["assets/formatos/F1_005_Registro_De_Recepcion_De_Llamada.docx","088ed5a947a4b0382f7fa1b0237ae738"],["assets/formatos/F1_007_Caratula.docx","fcd095f90603899aa0eb9ee4801542cd"],["assets/formatos/F1_008_Entrevista.docx","b38a6cff76872db7fac775d6cdee30ef"],["assets/formatos/F1_009_Oficio_Solicitud_A_Servicios_Periciales.docx","adf4730c13c63da387b1371588e7044e"],["assets/formatos/F1_010_Solicitud_Examen_Psicofisico.docx","1579661e08b4ad8da17767fef986c328"],["assets/formatos/F1_011_Oficio_Solicitud_A_Policia_Ministerial.docx","bed683a6b0dbe7c492d812cc6c1d61ae"],["assets/formatos/F1_016_Y_F1_015_Formato_De_Acuerdo_De_Inicio.docx","0b3593ab12947bb85b925b923a06714b"],["assets/formatos/F1_021_Oficio_Solicitud_A_Policia_Ministerial_Sin_Apercibimiento.docx","a506c3598a9b62a942f65da9279a42ac"],["assets/formatos/F2_117_Registro_De_Derivacion_A_La_Unidad_De_Mecanismos_Alternativos.docx","59ff9271834aa98b888b6d2d2757e7ba"],["assets/images/Acuerdos/acuerdo.svg","390de7828f60d9865cd6452a0dca562c"],["assets/images/Acuerdos/acuerdoRadicacion.svg","bdd64fd0519d86ed763ffad7e70640b8"],["assets/images/Conclusiones/folder.svg","2771ca21b2c76587510f3136bc0fb5a8"],["assets/images/Conclusiones/lawyer.svg","dd6aaa238c997b769838adbe4388e1be"],["assets/images/Conclusiones/quill.svg","5177416bef1a31c3fa78ee75491b8bcf"],["assets/images/NoticiaDeHechos/acuerdo.svg","17b2d5e42ea0abc289a2c3e87ac1e0da"],["assets/images/NoticiaDeHechos/acuerdosC.svg","3fea81158d146f15b117ca91ba50b155"],["assets/images/NoticiaDeHechos/conclusionesC.svg","6adba9cc77bca5dd1eb0a4ccaa7040a1"],["assets/images/NoticiaDeHechos/entrevistasC.svg","066bcece450fb8e458fdf863f68a4261"],["assets/images/NoticiaDeHechos/solicitudes.svg","b0ea1e08944cc811b6e8ae9c73f15bc0"],["assets/images/Solicitudes-preliminares/contratos.svg","fd828fc92d913ae891ba48e9e83c40ce"],["assets/images/Solicitudes-preliminares/detective.svg","dd12e724696826b815e428046dc35126"],["assets/images/Solicitudes-preliminares/evidence.svg","d846fd2a67e7b7c60ee009aad60c9580"],["assets/images/Solicitudes-preliminares/fingerprint.svg","3910f25823544b967c213f1d1fa09b72"],["assets/images/Solicitudes-preliminares/letter.svg","a633fd4c7011266f623ca6a1b936df23"],["assets/images/Solicitudes-preliminares/policeCap.svg","24b59b852ba5d240cd8e64692e00c0ab"],["assets/images/favicon/favicon.png","88a61c6366f315e417fe4869fedbdb19"],["assets/images/iconos/arma.svg","84111c904595a9e8b3a28a6eb33c388d"],["assets/images/witness.svg","ba553aec2e9f0b33fb07062e8d3e0fd8"],["assets/js/material.js","60f3ee61721d5bbac709fad9c239f2ac"],["assets/js/material.min.js","713af0c6ce93dbbce2f00bf0a98d0541"],["assets/js/material.min.js.map","3817e20bd704457b5e74a39596a40d3e"],["assets/sass/bootstrap/_alert.scss","7bfb8be9e15349849832561b14e0f624"],["assets/sass/bootstrap/_badge.scss","1c3fa87acc420d19113f1aa0fe688e0c"],["assets/sass/bootstrap/_breadcrumb.scss","72b4872baff6a5b3ec2502a356deca9c"],["assets/sass/bootstrap/_button-group.scss","cc8a2a59d86748f459761076641f6079"],["assets/sass/bootstrap/_buttons.scss","21670a18b3801db2889ca706b64e53e5"],["assets/sass/bootstrap/_card.scss","0968b02fa06bf876797423849de2ef64"],["assets/sass/bootstrap/_carousel.scss","e117b7ea365f4920c9b0a5440954be6b"],["assets/sass/bootstrap/_close.scss","de771481711dad5a2e84110808bd5e55"],["assets/sass/bootstrap/_code.scss","bb059a824fa06abf4ad1484c1b1d884f"],["assets/sass/bootstrap/_custom-forms.scss","36df6a9ab9931b9868a9ae797aa5eea3"],["assets/sass/bootstrap/_dropdown.scss","331b076ec9d133b70f88e77b63ac79ac"],["assets/sass/bootstrap/_forms.scss","560777997728e194f9869bc9ea3dc611"],["assets/sass/bootstrap/_functions.scss","acc5577c45bf99c09309879188be09f1"],["assets/sass/bootstrap/_grid.scss","06e714c57277b62816c9bf723b246e69"],["assets/sass/bootstrap/_images.scss","d1c038ef22fe735993aed2e041fd6a74"],["assets/sass/bootstrap/_input-group.scss","8ac4fb7756a2b399f76ad3f38b0d49c5"],["assets/sass/bootstrap/_jumbotron.scss","df9d9701ed5302a84aaac08a0053f0fb"],["assets/sass/bootstrap/_list-group.scss","974aa045f5990bcfc66f320834f1b315"],["assets/sass/bootstrap/_media.scss","d2ea169e5ccb567ff12e945885a90fa6"],["assets/sass/bootstrap/_mixins.scss","05a773922899b73bdc96df9e09e9bb25"],["assets/sass/bootstrap/_modal.scss","d271a0f2da7cb0db5becd1ca0af5f022"],["assets/sass/bootstrap/_nav.scss","447f2640555879ea9d2a5cf9fde7a7b2"],["assets/sass/bootstrap/_navbar.scss","7972c203f65bb13aa7125f60f5a52823"],["assets/sass/bootstrap/_pagination.scss","78377ce4c5588a0ce0e6b0aa63ae1645"],["assets/sass/bootstrap/_popover.scss","05a0ca73c9450a69bd0f277d693224b7"],["assets/sass/bootstrap/_print.scss","76517b31aa858c154671b2a2e5770fd0"],["assets/sass/bootstrap/_progress.scss","c7463cac2e4865b2b3d7df041789a461"],["assets/sass/bootstrap/_reboot.scss","da10c113d6bae2b727001bd838ba8d1f"],["assets/sass/bootstrap/_tables.scss","3148ff5e956482dbe831b73f3b263d92"],["assets/sass/bootstrap/_tooltip.scss","2e0bdd187ce1f3f5a366494cce9975b6"],["assets/sass/bootstrap/_transitions.scss","3d2c698ffcd92914d15995ec512bc7bd"],["assets/sass/bootstrap/_type.scss","841519f1d52b2cee384bf1186db30562"],["assets/sass/bootstrap/_utilities.scss","6796309c0a9a03c934f743f238a5eb8b"],["assets/sass/bootstrap/_variables.scss","6a47bec68cedbb06ff18119fa6eea47f"],["assets/sass/bootstrap/bootstrap-grid.scss","dc15c5077e072f835588bc61578a768d"],["assets/sass/bootstrap/bootstrap-reboot.scss","64bb7f82dfcafe0911a27521d3a813a0"],["assets/sass/bootstrap/bootstrap.scss","1edd643d4a34099a5ea92b80f43f49b1"],["assets/sass/bootstrap/mixins/_alert.scss","6ce4c16f120865f12a10072ba829131f"],["assets/sass/bootstrap/mixins/_background-variant.scss","c4ac8edcd4b25aab0354f306867d225b"],["assets/sass/bootstrap/mixins/_badge.scss","6b5a844d5a9650fee75afe48c2fc6fa6"],["assets/sass/bootstrap/mixins/_border-radius.scss","534186d88eaa34cd09fa9c5e6ffb5d9e"],["assets/sass/bootstrap/mixins/_box-shadow.scss","0734cb894c290124df54c0e58ed520a6"],["assets/sass/bootstrap/mixins/_breakpoints.scss","506942499bf84fded881f86a2750f3f1"],["assets/sass/bootstrap/mixins/_buttons.scss","ce5b64583e0e3ac91f624b10f0bebf99"],["assets/sass/bootstrap/mixins/_clearfix.scss","f8d39651a1054cf73e1d56ad398c0af0"],["assets/sass/bootstrap/mixins/_float.scss","381aaac1531fbc1314d76fc66dc538d6"],["assets/sass/bootstrap/mixins/_forms.scss","1b0d4964f29ea1548be9047a9aef6bca"],["assets/sass/bootstrap/mixins/_gradients.scss","400c6e0dbb2ff55b460e98de73694091"],["assets/sass/bootstrap/mixins/_grid-framework.scss","5aa1188a460f4ebd2660c9973303b702"],["assets/sass/bootstrap/mixins/_grid.scss","9b4a6d2d93a856510640c1ff09d0c56c"],["assets/sass/bootstrap/mixins/_hover.scss","437bd9adb08faf19e67a539bb8a38d6e"],["assets/sass/bootstrap/mixins/_image.scss","dbc7c2ac322c012472fbefda1d414c27"],["assets/sass/bootstrap/mixins/_list-group.scss","af5fc667867710ef3c81a8765a688eec"],["assets/sass/bootstrap/mixins/_lists.scss","c7e34a356a8616f3ad20b7bf88c93854"],["assets/sass/bootstrap/mixins/_nav-divider.scss","cc264bfe3dc36a3229d876bdf4706b35"],["assets/sass/bootstrap/mixins/_navbar-align.scss","222027e5e6a7713cce84a9122f3dc84b"],["assets/sass/bootstrap/mixins/_pagination.scss","dac3e7dbc8c3d3984574b2b717f37207"],["assets/sass/bootstrap/mixins/_reset-text.scss","5824f6d674817d2340645a06017f162e"],["assets/sass/bootstrap/mixins/_resize.scss","af032cea5fd5e37d9a5a8b971e290ff4"],["assets/sass/bootstrap/mixins/_screen-reader.scss","27628061b7f5bf6ad86ec6756795a722"],["assets/sass/bootstrap/mixins/_size.scss","d21a0400871d28cfa21ca6ca6aded272"],["assets/sass/bootstrap/mixins/_table-row.scss","60382810086bb5f2cf98791bd45ee1b6"],["assets/sass/bootstrap/mixins/_text-emphasis.scss","cda95d97dcc3434316d7bb47438ab9ad"],["assets/sass/bootstrap/mixins/_text-hide.scss","7c81b089a0a09c0eca07b3f5ea4cb7af"],["assets/sass/bootstrap/mixins/_text-truncate.scss","c51a1018bf42368c45eb12d6ac16f938"],["assets/sass/bootstrap/mixins/_transition.scss","ecac75471a51869410e79ecafb257aa7"],["assets/sass/bootstrap/mixins/_visibility.scss","da163648232cbce3539b11b39188a838"],["assets/sass/bootstrap/utilities/_align.scss","dd730dc17bfe7392ac5d12d43b055811"],["assets/sass/bootstrap/utilities/_background.scss","847c069a9b2811014b6cdc8508c68bc5"],["assets/sass/bootstrap/utilities/_borders.scss","2e4624a79a71ec143b35da0f87d15f18"],["assets/sass/bootstrap/utilities/_clearfix.scss","01ed6cc705196c6f0fe33300de134ee7"],["assets/sass/bootstrap/utilities/_display.scss","2278478af39d03ed3531cbef2f33b400"],["assets/sass/bootstrap/utilities/_embed.scss","8dffa88a0a583613970d49886340991c"],["assets/sass/bootstrap/utilities/_flex.scss","40e4aea28d68a35ef50b6a02330e798a"],["assets/sass/bootstrap/utilities/_float.scss","d15b3c16fde3ee08d8bc2b38c2830f28"],["assets/sass/bootstrap/utilities/_position.scss","5ce30cb36bdcea620f9d28173ae82a20"],["assets/sass/bootstrap/utilities/_screenreaders.scss","84c388e27d908d2489d1724f464cdc71"],["assets/sass/bootstrap/utilities/_sizing.scss","60f70140674fd43f03610b1d8d5df6df"],["assets/sass/bootstrap/utilities/_spacing.scss","d193d1f01ba0dd6028962524e049243a"],["assets/sass/bootstrap/utilities/_text.scss","569826f5eb913c45a74fab518aeefc9c"],["assets/sass/bootstrap/utilities/_visibility.scss","efe6b7991e3b1924fc26d0ace1a71bc6"],["assets/sass/custom-material/custom-material.scss","469631b1efb645e5501d57fece478108"],["assets/sass/custom-palette.scss","11ebe116541e434ba44f78a38a2b3746"],["assets/sass/datepicker/datepicker.component.scss","aac79ca38139d4746d1b21d6a5c509b3"],["assets/sass/materialize/components/_badges.scss","39e9ab9adf252fc9ae64a92db4d997b9"],["assets/sass/materialize/components/_buttons.scss","57b8035b80ec5bdcd1618011b14cf374"],["assets/sass/materialize/components/_cards.scss","4df798035b8fc451e56622be22317b1d"],["assets/sass/materialize/components/_carousel.scss","339b461ce01e70fb659286479ec65291"],["assets/sass/materialize/components/_chips.scss","02fac07beb019d8d2fbc614392814dbf"],["assets/sass/materialize/components/_collapsible.scss","57ae90cf51abae54494af44f54cc184a"],["assets/sass/materialize/components/_color.scss","6e21b09976d540d5b57e9cb499b275fe"],["assets/sass/materialize/components/_dropdown.scss","697fcb0b446ac6508c9cf5c4b3bd1c1f"],["assets/sass/materialize/components/_global.scss","569d82b3a07a9d52197921a15f87b1c2"],["assets/sass/materialize/components/_grid.scss","6e1dee3a10b613287eac46480167cfdc"],["assets/sass/materialize/components/_icons-material-design.scss","7f548f65426d8b7df666b4feae8f47fd"],["assets/sass/materialize/components/_materialbox.scss","f382cf440739591462ec5a11c2590f86"],["assets/sass/materialize/components/_modal.scss","007162f974b3e3b54c31172571557df2"],["assets/sass/materialize/components/_navbar.scss","fd985083a5c19d58643c212be0b0ab9d"],["assets/sass/materialize/components/_normalize.scss","470184e3def7ec97a306212c735a7798"],["assets/sass/materialize/components/_preloader.scss","02bff31b510027bbc82ac28e8d3b5e5b"],["assets/sass/materialize/components/_pulse.scss","0168635c4f61a73a1384bf1fb2650d7c"],["assets/sass/materialize/components/_roboto.scss","b8ed4b08fd6ad663b7f8a308e989bc17"],["assets/sass/materialize/components/_sideNav.scss","874b78b51168bb2b95855838fcb84c42"],["assets/sass/materialize/components/_slider.scss","e9975847b5051eacb657fbe68858d020"],["assets/sass/materialize/components/_table_of_contents.scss","fbfa72d11edb0141b758299304fbfbeb"],["assets/sass/materialize/components/_tabs.scss","fab04b4cf7e8d58a1bea86e7beb8ff5d"],["assets/sass/materialize/components/_tapTarget.scss","bb22ba2fc88fc2ffc64bfeb283da2e61"],["assets/sass/materialize/components/_toast.scss","e7a14e221a5da9b19f756b3dd9d0ac92"],["assets/sass/materialize/components/_tooltip.scss","d6424daa6992f11468c8e88bc3477024"],["assets/sass/materialize/components/_transitions.scss","cdc0c87c65cff7fffabbb63bc37e8dfb"],["assets/sass/materialize/components/_typography.scss","cc3e7624a5c9be4a97b861ce53682b33"],["assets/sass/materialize/components/_variables.scss","5afea7876ced3790106ea3868d3c080c"],["assets/sass/materialize/components/_waves.scss","a74750fbfa54a9950abbd753f2604775"],["assets/sass/materialize/components/date_picker/_default.date.scss","ef2281b8fd5c4a834d9d608ea1416d31"],["assets/sass/materialize/components/date_picker/_default.scss","eb3a1cd58990476d960c7869906fd58f"],["assets/sass/materialize/components/date_picker/_default.time.scss","73ad6d072d2e2df59b773bb82778e2e1"],["assets/sass/materialize/components/forms/_checkboxes.scss","682b3a3a3bf0766564f6561d9d56e3d3"],["assets/sass/materialize/components/forms/_file-input.scss","98a89343de02a1873ad6120353462fa3"],["assets/sass/materialize/components/forms/_forms.scss","ea5dad4739ed6f6570f21a05c4c91b98"],["assets/sass/materialize/components/forms/_input-fields.scss","2cc6c66e760f3aa46a694ca98b7a75de"],["assets/sass/materialize/components/forms/_radio-buttons.scss","8bc408f143b578c1ff928e6695370b2b"],["assets/sass/materialize/components/forms/_range.scss","a067a246dcd8bafe5467e0fd5ea91b9a"],["assets/sass/materialize/components/forms/_select.scss","08f3fab9d42508e933b1620acc5ea3c2"],["assets/sass/materialize/components/forms/_switches.scss","aa89251ae4bf37c97edd0892b5ad5e36"],["assets/sass/materialize/materialize.scss","d24e908b8dd4c42dd9d12314da899d99"],["assets/sass/theme.scss","fc8cff328129e064c5f6709d3b1fcd2c"],["assets/sass/theme/_Synchronize.css","6070ef1f02aeccad90660905dc86bc8a"],["assets/sass/theme/_alerts.scss","e974003298380d7765e0f73327ff723d"],["assets/sass/theme/_breadcrumb.scss","1cac569fc9943160e99cd329886eda96"],["assets/sass/theme/_dialog.scss","e29606e3f821e60c5a88c96d0d76d197"],["assets/sass/theme/_notify.scss","d841119b79591e0cc42d9dc5f8043d06"],["assets/sass/theme/_table.scss","dd24ee080eb454f3bcbca1c82acdfd9a"],["assets/sass/theme/_tabs.scss","85f245b76ed04bacb9378a45a091dd2c"],["assets/sass/theme/_verticalTabs.scss","c05b26be93ad1f11f8829c9652c2c94a"],["index.html","876f104e8c25d97ce304744d667419b8"],["inline.aeb5828da0c8677d99a0.bundle.js","67f5c11a304cf83be880382f7facd697"],["main.8c02b0ab7134215e4d18.bundle.js","91b845dcf2b6ca18eb0a1cadbbaf443f"],["polyfills.54377454b9171db571fa.bundle.js","61fe8ad3057c27f0723efeb039072fc1"],["scripts.9f024f4dba27f3e8cc72.bundle.js","a398a4c34f1fd90aad52eaf89c1499fa"],["styles.a0ac000011da9d0f88c4.bundle.css","a0ac000011da9d0f88c4368eae205396"],["vendor.d5e190f8ce1f43610e96.bundle.js","e37a64dac580667f607e5b30de67ad10"]];
var cacheName = 'sw-precache-v3-sw-precache-' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function (originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '/index.html';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});








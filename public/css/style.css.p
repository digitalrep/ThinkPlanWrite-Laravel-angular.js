body {
	font-family: 'Raleway';
	margin-top: 25px;
	height: 100%;
}
.page {
	padding: 24px;
	min-height: 71vh;
}
#back-to-top {
	position: fixed;
	bottom: 60px;
	right: 30px;
	z-index: 99;
	background: #333;
	padding: 8px 12px;
	color: #fff;
	cursor: pointer;
	border-radius: 10px;
	font-weight: bold;
}
.new-log input,
.new-log select  {
	margin-bottom: 8px;
}
.panel label, 
.new-log label {
	font-weight: normal;
}
.new-log select option {
	padding: 4px 0 !important; 
}
nav.navbar { z-index: 1112; }
.container,
.container-fluid {
	height: 100%;
}
.panel-default > div > .panel-heading {
	color: #333;
	background-color: #f5f5f5;
	border-color: #ddd;
}
.row {
	margin: 0;
}
.rerow { margin-right: -15px; margin-left: -15px; }
.tpw-icons, .details { background: #f4f4f4; }
h1, h2, h3, h4 {
	margin-top: 20px;
	margin-bottom: 20px;
}
h1 {
	margin-top: 40px;
	margin-bottom: 40px;
	font-size: 32px;
}
h2.privacy {
	margin: 40px 0;
}
.table-striped>tbody>tr>td {
	padding-left: 16px;
}
.table-striped>tbody>tr>th {
	padding: 12px;
	padding-left: 16px;
}
.table-striped>tbody>tr>td:last-child,
.table-striped>tbody>tr>th:last-child {
	padding-left: 8px;
	padding-right: 16px;
}
.help>td {
	width: 25%;
}
.help>td:last-child {
	background: #ddd;
}

#highlighters { 
	display: none;
	z-index: 100;
	padding: 6px;
	background: #fff;
}

#newchartitle {
	border: solid 1px #ddd;
	box-shadow: none; 
	padding: 0; 
	-webkit-box-shadow: none;
	padding-left: 12px;
	background: #fff;
	color: #000;
}

#mysteryCanvas {
	width: 70%;
	height: auto;
}
.main-img {
	max-width: 600px;
	width: 50%;
}

/* for bootswatch theme */

.plotpoints_list .glyphicon {
	margin-top: 8px;
	font-size: 14px;
}
.panel-group .panel {
    margin-bottom: 20px;
}
h1, h2, h3, h4, h5, h6, h7 { font-family: Raleway; }
.table>thead>tr>th, .table>tbody>tr>th, .table>tfoot>tr>th, .table>thead>tr>td, .table>tbody>tr>td, .table>tfoot>tr>td { vertical-align: middle; }
.table>tr.projects>th { padding: 12px; }
tr.projects > th { padding: 14px; }
.subheading { font-weight: bold; }
tr.projects > th { font-weight: normal; }
.well {

}
.stripe {
	background: #f9f9f9;
}
.plot > .panel-body {  }
input#newpptitle,
input#pptitle,
textarea#newppdesc,
textarea#ppdesc {
	background: transparent;
}
div.plot, 
#newcharbio,
textarea {
	background: transparent;
	color: #555;
}
div.plot {
	width: 23%;
	margin: 1%;
}
div.plot > .panel-body {
	overflow-y: auto;
}
div.panel-stat {

}
button.btn {
	padding: 6px 12px;
}
button.btn-default {

}
.modal-header h3 { font-size: 20px; font-family: Raleway; }
input[type="text"],
input[type="email"],
input[type="password"] {
	border: 1px solid #ccc;
	color: #333;
}
.tpw {
	background: #00ffcf;
	line-height: 1;
	margin-top: -28px;
	padding: 20px 0;
}
.tpw h2 {
	text-shadow: 0;
	color: #2f353a;
}
table.cal th { background: #ddd; }

.plot > .panel-body,
.plot > .panel-heading,
.plot > .panel-footer {

}
.plot > .panel-body {
	border-top: 0;
	border-bottom: 0;
}
.plot > .panel-heading {
	padding: 15px;
}

@media screen and (max-width: 960px) {
	div.border-bottom {
		border-bottom: 0;
		border-left: 0;
		border-right: 0;
	}
	table.table>tbody>tr>td,
	table.table>tbody>tr>th,
	table.table>tbody>tr.projects>td	{
		background: transparent;
	}
	div.panel-body>div.plot>div.newchar {
	}
	div.plot {
		width: 48%;
		margin: 1%;
	}
}

@media screen and (max-width: 780px) {
	div.char_gender {
		padding: 4px 0 2px 0;
	}
	div.char_age {
		padding: 3px 0 4px 0;
	}
}

@media screen and (max-width: 640px) {
	div.plot {
		width: 98%;
		margin: 1%;
	}
}

.single-writing-details {
	margin-bottom: 0;
}
.single-writing-details .table-striped {
	border-collapse: separate;
}

/* parallax */

.parallax {
	background-image: url('../images/typewriter.png');
	height: 100vh;
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
}
.call {
	background: #697075;
	padding: 42px 0;
	width: 100%;
	text-align: center;
}
.call p {
	font-size: 22px;
	margin-bottom: 48px;
	color: #fff;
}


@media only screen and (max-device-width: 1024px) {
    .parallax {
        background-attachment: scroll;
		background-size: 75%;
    }
	.call .btn {
		margin-bottom: 24px;
	}
}

/* plotpoints */

#newpptitle, #pptitle {
	border: 0; 
	background: #f5f5f5; 
	box-shadow: none; 
	padding: 0; 
	-webkit-box-shadow: none; 
	font-weight: bold;
	margin-left: 2px;
}
#pptitle {
	width: 90%; 
	display: inline-block;
}
#newppdesc, #ppdesc {
	width: 100%; height: 100%; border: 0; background: #f5f5f5; margin-bottom: 12px;
}

/* characters */

.panel-body > div.plot > div.newchar, 
.panel-body > div.plot > div.exchar {

}
.plot { border: 0; }
#chartitle {
	border: 0; 
	background: #f5f5f5; 
	box-shadow: none; 
	padding: 0; 
	font-weight: bold;
	-webkit-box-shadow: none;
	padding-left: 12px;
	margin-bottom: 2px;
	color: #000;
}
#newchardesc {
	width: 100%; 
	height: 95%; 
	border: 0;
}	

/* writings sortable list */

.filler {
	border: 0; 
	display: inline-block; 
	height: 16px;
	width: 12px;
	margin-right: 1%;
	vertical-align: middle;
	border-radius: 20px;
}
.myHandle {
	display: inline-block;
}
.writings_list,
.plotpoints_list {
	list-style: none outside none; 
	margin: 0; 
	padding: 0;
}
.writings_list li {
	padding: 8px 1%;
	margin: 0;
	padding: 12px; 
	border-bottom: solid 1px #e4e4e4;
}
.writings_list li:last-child {
	border-bottom: 0;
}
.plotpoints_list li {
	margin: 0;
}
.panel-default > .writing_header {
	background: #f9f9f9;
	padding: 12px 15px;
}
.writings_list li span,
.writing_header span {
	display: inline-block;
}
.writings_list .myHandle {
	margin-top: 2px;
}
.writing_header span {
	font-weight: normal;
}
.writing_date {
	width: 9%;
}
.writing_content {
	width: 40%;
}
.writing_del_count {
	width: 9%;
}
.writing_del {
	text-align: right;
}
.writing_title {
	width: 20%;
}
.myHandle {
	width: 1%;
	margin-right: 1%;
	border-radius: 20px;
	display: inline-block;
	height: 16px;
	width: 16px;
	vertical-align: middle;
	cursor: move;
}

@media screen and (max-width: 1470px) {
	.writings_list .opt,
	.writing_header .opt {
		display: none;
	}
	.writing_content	{
		width: 54%;
	}
	.writing_del_count {
		width: 9%;
	}
	.writing_title {
		width: 22%;
	}
}

@media screen and (max-width: 768px) {
	/* writing list iphone */
	.writings_list .opt,
	.writing_header .opt {
		display: none;
	}
	.writings_list .writing_count, 
	.writings_list .writing_content {
		display: none;
	}
/*
	.writing_del_count {
		width: 36%;
	}
*/
	.writings .panel-body {
		padding: 0;
	}
	.writing_title {
		width: 58%;
	}
}

/* calendar */

.cal { width: 100%; }
.cal th, .cal td {
	padding: 4px;
}

/* spinner */

.loader_container {
	width: 100%;
	height: 100%;
	background: #fff;
	z-index: 10;
	position: absolute;
}
.loader {
    border: 16px solid #3e444c; /* dark grey */
    border-top: 16px solid #6c9a90; /* Green */
    border-radius: 50%;
    width: 120px;
    height: 120px;
	-webkit-animation: spin 2s linear infinite;
    animation: spin 2s linear infinite;
	position: absolute;
	left: 50%;
	top: 50%;
	margin: -100px 0 0 -60px;
}

/* character inputs */

.char_gender {
	padding: 4px 4px 4px 0;
}
.char_age {
	padding: 4px 0 4px 4px;
}

@-webkit-keyframes spin {
	0% { -webkit-transform: rotate(0deg); }
	100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* jumbotron */
.centred {
	text-align: center;
}
.jumbotron {
	display: block;
	text-align: center;
	width: 100%;
	background: transparent;
}
.jumbotron img {
}
.jumbotron p,
.jumbotron h1 {
	display: inline;
}
.jumbotron p {
	font-family: 'Raleway';
	font-weight: bold;
	width: 100%;
	float: left;
	margin-bottom: 24px;
}

/* login */

.login-error {
	color: red;
}
.panel-login {
	border: 0;
	min-height: 65vh;
    -webkit-box-shadow: none;
    box-shadow: none;
	height: 75vh;
}
.panel-login h3 {
	margin-bottom: 0px;
}

/* a */

a {
	color: #6c9a90;
	color: #8fbeb4;
}
a:hover {
	color: #aaa;
	text-decoration: none;
}
a.home:hover {
	color: #ddd;
	text-decoration: none;
}
.nav, .pagination, .carousel, .panel-title a { 
	cursor: pointer; 
	font: Raleway;
}
.pink {
	background: rgb(226, 158, 169);
	border-color: rgb(226, 158, 169);
	color: white;
}
.pink:hover {
	color: white;
}
.yellow {
	background: rgb(239, 212, 168);
	border-color: rgb(239, 212, 168);
	color: white;
	margin-right: 18px;
}
.yellow:hover {
	color: white;
}

.plotwheel-select {
	margin: 24px auto;
}

/* inputs */

.btn-info,
input[type=submit].btn-info {
	background: #6c9a90;
	border-color: #6c9a90;
	text-shadow: none;
	color: #fff;
}
.btn-info:hover,
input[type=submit].btn-info:hover {
	background: #538278;
	border-color: #538278;
}
input[type="submit"],
button[type="submit"] {
	color: #fff;
	background: #337AB7;
	border-color: #337AB7;
	display: inline-block;
	padding: 6px 12px;
	margin-bottom: 0px;
	font-size: 14px;
	font-weight: 400;
	line-height: 1.42857;
	text-align: center;
	white-space: nowrap;
	vertical-align: middle;
	cursor: pointer;
	-moz-user-select: none;
	background-image: none;
	border: 1px solid transparent;
	border-radius: 4px;
}
input[type="submit"]:hover,
button[type="submit"]:hover	{
	color: #FFF;
	background-color: #286090;
	border-color: #204D74;
	text-decoration: none;
}
input[type="text"],
input[type="email"],
input[type="password"] {
	display: block;
	width: 100%;
	height: 34px;
	padding: 6px 12px;
	font-size: 14px;
	line-height: 1.42857143;
	background-image: none;
	background: #fff;
	border-radius: 4px;
	-webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
	box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
	-webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
	-o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
	transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
}
.navbar-inverse {
	background: #3e444c;
}
.navbar-inverse .navbar-nav > li > a:hover {
	background: #1c1e22;
}
.navbar-inverse .navbar-nav > li > a {
	border: 0;
	color: #fff;
}
.navbar-inverse .navbar-brand { color: #fff; }
.jumbotron { border: 0; }

/* front page */

.phones {
	text-align: center;
}
.feature-list ul {
	text-align: left;
	padding-left: 60px;
}
.line {
	margin: 0 auto;
    width: 90%;
    border-top: 1px solid #3e444c;
}
.imgs {
	max-width: 313px;
	max-height: 618px;
	margin: 0 auto;
	width: 50%;
}
.phones .details {
	margin: 0 auto;
}
.feature-list {
	margin: 60px auto;
	width: 360px;
}
.phones .details ul {
	text-align: left;
}
.slick-prev,
.slick-next {
	z-index: 1111;
}
.phones .imgs > img,
.slick-slide {
	max-width: 100%;
}
.phones .details > h1 {
	margin-top: 48px;
	margin-bottom: 20px;
}
.phones .details > h2 {
	margin-top: 8px;
	margin-bottom: 48px;
	font-weight: normal;
}
.phones .details h2,
.phones .details h1,
.phones .details ul {
	margin-left: 24px;
	color: #fff;
}
.feature-list > ul li {
	padding: 12px 0;
	color: rgb(51, 51, 51);
}
#projects > li  > a {
	overflow: hidden;
	margin-bottom: 4px;
}
.writing {
	display: block;
	opacity: 0.1;
    position: absolute;
	top: 64px;
	left: 0;
	margin-left: 20px;
	margin-right: 10px;
	line-height: 1.8;
	font-family: serif;
	z-index: 2;
	text-align: left;
	text-transform: italic;
}
.info {
	text-align: center;
}
.char {
	width: 23%;
	margin-left: 1%;
	margin-right: 1%;
	padding-left: 0;
	padding-right: 0;
}

/* footer */

.footer {
	padding-top: 42px;
	width: 100%;
	display: block;
	background: #3e444c;
	color: #A1A1A1;
}
.footer ul {
	padding: 0;
}
.footer ul  > li {
	list-style-type: none;
}
.footer .col-md-12 {
	text-align: center;
	width: 100%;
}
.footer-last {
	background: #2e3338; 
	padding: 10px 0;
}
.footer span {
	display: block;
	margin-bottom: 12px;
    color: #fff;
}
.footer-last {
	margin-top: 32px;
}
.footer-last-section {
	bottom: 0;
}
.footer-brand {
	font-size: 18px;
}

/* writing list */

.writinglist-heading {
	width: 100%;
	float: left;
}
.writinglist-heading > p:hover {
	color: #aaa;
}
.writing-title {
	float: left;
	color: #6c9a90;
	width: 85%;
}
.writing-wordcount {
	float: right;
	color: #6c9a90;
	width: 15%;
	text-align: right;
}
.writing-updated {
	width: 100%;
	float: left;
	color: #333;
	margin: 0;
}
.writinglist {
	padding: 13px 20px;
	background: #eee;
	margin-bottom: 4px;
	overflow: auto;
}
.writinglist span.input {
	display: block;
	overflow: hidden;
	padding-left: 12px;
	margin-top: 8px;
}
.writinglist span.new_input {
	padding-left: 0;
	padding-right: 56px;
}
.writinglist button {
	top: 21px;
	right: 15px;
	position: absolute;
}
.writinglist .glyphicon-search {
	float: left;
	color: #aaa;
	margin-top: 8px;
}
ul#projects .active_project,
.active_writing {
	background: #aaa;
	color: #fff;
}
.writing-content-container {
	width: 100%;
}
.writing-content {
	width: 100%;
	height: 80vh;
	padding: 12px;
	border: 0;
	-moz-box-sizing: border-box;  
    box-sizing: border-box;       
   -webkit-box-sizing: border-box; 
}
.writing-list-item:focus .writing-title,
.writing-list-item:focus .writing-wordcount,
.writing-list-item:focus .writing-updated {
	color: #fff;	
}
.writinglist-heading .project-title {
	width: 80%;
}
.writinglist-heading .project-title,
.writinglist-heading .project-wordcount {
	margin: 0;
	color: #6c9a90;
	float: left;
}
.writinglist-heading .project-wordcount {
	float: right;
}
.writing-header {
	background: #eee;
	padding: 10px;
	overflow: auto;
	margin-bottom: 8px;
}
.writing-header .writing-title {
	width: 100%;
}
.writing-header .writing-updated {
	width: 84%;
	float: left;
	margin: 0 0 0 4px;
	color: #6c9a90;	
}
.writing-header .writing-wordcount {
	margin: 0 4px 0 0;
	width: 14%;
}
.writing-alert {
	float: left;
	width: 100%;
}
.writing-title span {
	display: block;
	overflow: hidden;
	padding-right: 82px;
}
.writing-title {
	position: relative;
}
.writing-title a {
	float: right;
	position: absolute;
}
.writing-title a.del {
	top: 8px;
	right: 8px;
}
.writing-title a.sav {
	top: 8px;
	right: 32px;
}
.writing-title a.print {
	top: 8px;
	right: 58px;
}
ul#projects a.project-list {
	padding-top: 24px;
	padding-bottom: 15px;
}
.print-heading {
	display: none;
}
.words_selector2 {
	padding-left: 8px;
}

/* wells */

.well-yellow {
	border-color: #efd4a8;
	background: #fcf6ee;
}
.well-blue {
	background: #e3e6eb;
	border-color: #72849d;
}
.well-pink {
	background: #f9ecee;
	border-color: #e29ea9;
}
.well-orange {
	background: #fcf3ee;
	border-color: #efc3a8;
}	

/* stat panels */

.panel .pink-icon {
	color: #e29ea9;
}
.panel .yellow-icon {
	color: #a0cc8f
}
.panel .orange-icon {
	color: #efc3a8;
}
.panel-stat span {
	width: 100%;
	display: block;
	margin: 8px 0;
}
.panel-stat {
	background: #f5f5f5;
	text-align: center;
	height: 180px;
}
.panel .blue-icon {
	color: #72849d;
}
.panel-blue span {
	width: 100%;
	display: block;
	margin: 8px 0;
}
.stat {

}
.stat-right {
	padding-right: 0;
	padding-left: 15px;
}
.stat-number {
	font-size: 18px;
	font-weight: bold;
}
.stat img {
	margin: 12px 0;
}

.views {
	margin-top: -7px;
}
.project-title {
	display: block;
	overflow: hidden;
	padding-right: 124px;
}
.single-writing-title {
	display: block;
	overflow: hidden;
	padding-right: 12px;
}
.update-project {
	position: absolute;
	top: 25px;
	right: 0px;
}

/* research (masonry bricks) ---				possibly unused now */

.research-container {
	overflow: overlay;
	position: relative;
	width: 100%;
}
.research {
	position: absolute;
	top: 0;
	left: 0;
	-webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
	width: 100%; 
	height: 100%; 
	display: block; 
	border: 0; 
	border-left: solid 1px #ddd; 
	border-right: solid 1px #ddd; 
	padding: 14px;
}
#research_details {
	padding: 2px 0;
	min-height: 100vh;
}
#research_details .note {
	border: solid 4px #fff;
	margin-bottom: 2px;
}
a.research-icon {
	padding-bottom: 4px;
	padding-top: 6px;
	display: inline-block;
}
.views img:hover,
.research-icon img:hover {
	opacity: 0.4;
}
.query {
	margin-right: 0;
}
.single {
	padding: 8px;
}

.charts { padding: 0; }
#dropdownMenu1:hover { opacity: 0.4; }

/* add writing / project at bottom of table */

#project_table .panel-footer {
	position: relative;
}
#project_table span {
	display: block;
	overflow: hidden;
	padding-right: 118px;
}
#project_table .panel-footer input {
	width: 100%;
}
#project_table .panel-footer button {
	position: absolute;
}

.writings-table {
	border-bottom: 0;
}
.white_text { color: #c8c8c8; }
.file_upload_error { color: red; }
.file_upload_success { color: green; }
#chapters_details tr th:first-child,
#chapters_details tr td:first-child  {
	padding-left: 16px;
}
.project-table-list tr td:first-child {
	padding-left: 24px;
}
#chapters_details tr th:last-child,
#chapters_details tr td:last-child {
	padding-right: 16px;
}

/* These are things I've added recently that I haven't put in the right place yet */

/* Writing */

#new_w_title {
	display: inline-block;
	width: auto;
}
.dark {
	color: #000;
}

/* Projects */ 

.mobile { display: none; }
#writing_details, .research { z-index: 1; }
.cog { z-index: 1000; }

.single-footer { 
	overflow: auto;
}
#cog {
	margin-top: 6px;
	background: #f5f5f5; 
	border: 0;
}
.entry-content {
	width: 100%; 
	padding: 14px;
	border: 0;
}
.entry-content-text {
	resize: none; 
	overflow: hidden; 
	height: 46px;
	width: 100%;
	border: 0;
	padding: 14px;
	padding-bottom: 0;
}
.writing-info {
	background: #fcfcfc; 
	width: 100%; 
	border-bottom: solid 1px #ddd; 
	border-top: 0; 
	padding: 4px; 
	padding-left: 16px; 
	font-size: 12px;
}
.rel { position: relative; }
.writing-nav {
	background: #fcfcfc; 
	width: 100%; 
	border-bottom: solid 1px #ddd; 
	padding: 8px; 
	font-size: 12px; 
	overflow: auto;
}
#writingTextArea {
	-moz-appearance: none;
	outline: 0px none transparent;
	font-family: Raleway; 
	font-size: 16px; 
	width: 100%; 
	line-height: 1.8; 
	border: 0;	
}
#writingTextArea:focus {
	outline: 0;
}
#writing-textarea {
	position: absolute; top: 0; left: 0;
	font-size: 14px;
    border: none;
    overflow: auto;
    outline: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
}
#writing-div { font-size: 14px; }
.dash { padding-top: 56px; }

/* Logs */

.log-table {
	width: 100%;
}
.log-table th {
	font-weight: normal;
	color: #fff;
	background: rgb(239, 212, 168);
}
td.log-calendar {
	background: #f5f5f5; 
	padding: 4px; 
	height: 24px; 
	width: 32px; 
	border-collapse: separate; 
	border-spacing: 2px; 
	border: solid 2px #fff;
}
.month {
    padding: 20px 15px;
    width: 100%;
	background: rgb(226, 158, 169); 
	text-align: center;
}
.month ul {
    margin: 0;
    padding: 0;
}

.month ul li {
    color: white;
    font-size: 20px;
    text-transform: uppercase;
    letter-spacing: 3px;
	list-style-type: none;
}
.month ul li span:nth-child(2) {
	font-size: 18px;
}
.month ul li a {
	color: rgb(239, 212, 168);
}

/* Previous button inside month header */
.month .prev {
    float: left;
    padding-top: 10px;
}

/* Next button */
.month .next {
    float: right;
    padding-top: 10px;
}

/* Modal */
.modal-dialog {
    width: 600px;
    margin: 80px auto;
}
.modal-header {
	padding: 0 15px;
}
.modal-body {
    position: relative;
    padding: 30px 15px;
}

/* table stuff */
.table tr td table tr td {
	border: solid 1px #ddd;
	padding: 8px;
}

/* media queries */

@media screen and (min-resolution: 200dpi) {
	#writingTextArea { font-size: 16px; }
}

@media screen and (max-width: 1280px) {
	.phones .details h2 {
		margin-left: -8px;
		font-size: 22px;
		margin-bottom: 18px;
	}
	.phones .details h4 {
		font-size: 14px;
		margin-left: -8px;
		margin-bottom: 28px;
	}
	.phones .details ul {
		font-size: 12px;
		margin-left: 30px;
	}
	h5 {
		font-size: 12px;
	}
}
@media screen and (max-width: 960px) {
/* Project stats on projects page */
.tidbits .panel-body {
	padding: 4px 0;
}
	.col-sm-offset-0 .single-project-details { margin-bottom: 20px; }
	.research { z-index: 1; }
	#research_details, #writing_details { border-left: solid 1px #ddd; border-right: solid 1px #ddd; }
	.border-top { position: relative; }
	.border-bottom { border-bottom: solid 1px #ddd; border-left: solid 1px #ddd; border-right: solid 1px #ddd; }
	table.writings { border-bottom: solid 1px #ddd; }
	.filtery { height: 84px; }
	input.filter-writings { width: 97%; position: absolute; top: 38px; right: 12px;}
	.phones .details h2 {
		margin-top: 10%;
		font-size: 30px;
	}
	.phones .details h4 {
		font-size: 18px;
		margin-bottom: 48px;
	}
	.phones .details ul {
		font-size: 14px;
		margin-bottom: 48px;
	}	
	.charts { padding-left: 0; padding-right: 0; }
	.plisthead { display: none; }
	.col-lg-offset-0>.panel {
		margin-bottom: 12px;
	}
.col-lg-offset-0>.mobile-cal { margin-bottom: 12px; }
	.table>tbody>tr>td,
	.table>tbody>tr>th {
		vertical-align: middle;
	}
	.table>tbody>tr>td {
		background: #fff;
	}
	.pie {
		padding: 0;
	}
	.stat, .panel-stat {
		margin-bottom: 12px;
	}
	.table-striped {
		border-radius: 3px;
	}
	.table-striped th:first-child {
		border-radius: 3px 0 0 0;
	}
	.table-striped th:last-child {
		border-radius: 0 3px 0 0;
	}
	.table {
		font-size: 12px;
	}
	.projects {
		height: 48px;
	}
	.projects tr th {
		padding-top: 24px;
	}
	.panel { margin-bottom: 0; }
	#project_table {
		margin-bottom: 12px;
	}
	.table > tbody > tr.projects > td {
		background: #f9f9f9;
	}
	.stat-right {
		padding-left: 0;
	}
	.first-char { margin-bottom: 20px; }
}
@media screen and (max-width: 768px) {
	input.filter-writings { width: 96%; }
	.jumbotron img {
		width: 100%;
		margin-top: 4%;
	}
	.jumbotron p {
		margin-bottom: 12px;
	}
	#mysteryCanvas {
		width: 100%;
		height: auto;
	}
}
@media screen and (max-width: 640px) {
	.panel-footer  .pull-right {
		float: left!important;
	}
	.nopad {
		padding: 0;
	}
	.barchart { border: 0; }
	input.filter-writings { width: 94%; }
	#writing-days {
		margin-bottom: 24px;
	}
	#writing-days, #project_table {
		margin-bottom: 12px;
	}
	.panel, .col-lg-offset-0>.panel {  }
	.col-lg-offset-0>.mobile {
		display: block;
	}
	.optional {
		display: none;
	}
	.jumbotron img {
		max-width: 90%;
		padding-top: 4%;
		padding-bottom: 2%;
	}
	.jumbotron {
		min-height: 542px;
		height: 542px;
	}
	.jumbotron img {
		padding-top: 4%;
	}
	.jumbotron p {
		font-size: 17px;
	}
	.jumbotron a {
		margin-top: 4%;
	}
	.phones .details h4 {
		margin-top: 24px;
		margin-bottom: 12px;
		text-transform: uppercase;
		font-size: 12px;
		font-weight: bold;
	}
	.phones .details h2 {
		font-size: 22px;
	}
	.phones .details ul {
		margin-left: -8px;
		margin-top: 24px;
	}
	.info img {
		max-width: 120px;
	}
	.feature-list {
		width: 300px;
	}
	.imgs {
		padding-top: 56px;
	}
	.imgs button.slick-prev,
	.imgs button.slick-next {
		display: none !important;
	}
	.imgs .slick-slide img {
		width: 80%;
		margin: 0 auto;
	}
	.footer span {
		display: block;
		padding-top: 36px;
	}
	.panel-stat {
		height: clear;
	}
	#line {
		font-size: 6px;
	}
	.feature-list > ul li {
		padding: 6px 0;
	}
	.footer-last {
		font-size: 10px;
	}
	.footer { padding-top: 0; }
	
	/* writing screen on iPhone */
	.container-fluid {
		padding-left: 0;
		padding-right: 0;
	}
	.dash {
		padding-top: 42px;
	}
	.project-title {
		padding-right: 0; 
	}
	.update-project {
		position: relative;
		margin-top: 12px;
		width: 100%;
	}
	#project_table .panel-footer {
		overflow: auto;
	}
	#project_table .panel-footer button {
		position: relative;
		right: 0;
		top: 0;
	}
	#project_table span {
		padding-right: 0;
	}
	.phones .details h1, .phones .details h3 {
		margin-left: 0;
	}
	.single-writing-details .pull-right {
		float: left;
		width: 100%;
	}
	.single-writing-details .pull-right .btn {
		width: 100%;
		margin-top: 8px;
	}
	.single-writing-details .panel-heading {
		overflow: auto;
	}
	#pptitle {
		width: 60%;
	}
	h1 { font-size: 36px; }
	.phones {
		padding: 6px 0 36px 0;
	}
	.info {
		margin: 62px 0;
	}
}

@media screen and (-webkit-min-device-pixel-ratio:0) { 
  select,
  textarea,
  input {
    font-size: 16px;
  }
}

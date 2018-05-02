<!DOCTYPE html>
<html>
    <head>
        <title>Laravel</title>

        <link href="https://fonts.googleapis.com/css?family=Lato:100" rel="stylesheet" type="text/css">

        <style>
            html, body {
                height: 100%;
            }

            body {
                margin: 0;
                padding: 0;
                width: 100%;
                display: table;
                font-weight: 100;
                font-family: 'Lato';
            }

            .container {
                text-align: center;
                display: table-cell;
                vertical-align: middle;
            }

            .content {
                text-align: center;
                display: inline-block;
            }

            .title {
                font-size: 46px;
				margin-bottom: 24px;
            }
			p {
				font-size: 18px;
				margin: 12px;
				text-align: left;
			}
			blockquote {
				font-size: 24px;
				text-align: center;
				margin: 20px;
			}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="content">
                <div class="title">ThinkPlanWrite - Reset Your Password</div>
				<p>&nbsp;</p>
				<p>Hi,</p>
				<p>&nbsp;</p>
				<p>Click this link  
				<a href="
					<?php 
						$link = "https://www.thinkplanwrite.com/#/reset/" . $token . '/' . urlencode($user->getEmailForPasswordReset()); 
						echo $link;
					?>"> 
					<?php 
						echo $link; 
					?> 
				</a> to be taken to the page where you can reset your password.</p>
				<p>&nbsp;</p>
				<p>Regards,</p>
				<p>The ThinkPlanWrite Team</p>
            </div>
        </div>
    </body>
</html>

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
                <div class="title">Welcome to ThinkPlanWrite</div>
				<p>&nbsp;</p>
				<p>Hi <?php echo $name; ?>,</p>
				<p>&nbsp;</p>
				<p>This is just an email to say hi, and thanks for joining.</p>
				<p>Are you ready to go and create the next best selling novel right now?</p>
				<p>Just click this link: 
				<a href="<?php $link = "https://www.thinkplanwrite.com/#/verify/" . $confirmation_code; echo $link; ?>"> 
				<?php echo $link; ?> 
				</a> to verify your password and finish the account creation process.</p>
				<p>And remember, it was Laurell K Hamilton who once said, </p>
				<blockquote>My best advice about writing is - write. Writers write. The more you write the better you'll get at it.</blockquote>
				<p>So you'd better get onto it!</p>
				<p>&nbsp;</p>
				<p>Regards,</p>
				<p>The ThinkPlanWrite Team</p>
            </div>
        </div>
    </body>
</html>
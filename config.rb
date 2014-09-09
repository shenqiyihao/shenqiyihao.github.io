# Require any additional compass plugins here.

# set the css file encoding
Encoding.default_external = "utf-8"

# Compass will automatically add cache busters to your images based on image timestamps.
# This will keep browser caches from displaying the wrong image if you change the image but not the url.
# If you don’t want this behavior, it's easy to configure or disable:
# UNCOMMENT THE NEXT THREE LINES
#asset_cache_buster do |http_path, real_path|
#  nil
#end

# Set this to the root of your project when deployed:
http_path = "http://www.newweber.com/gls/"

# Set the images directory relative to your http_path or change
# the location of the images themselves using http_images_path:
# http_images_dir = "img"

# production assets url
# http_images_path = "http://pub.idqqimg.com/find/"
# image-url() example.
# Compass will automatically generate a relative URL to the file.
# background: image-url("logo-sprite.png") -277px 0 no-repeat;

css_dir = "css"
sass_dir = "sass"
images_dir = "img"
javascripts_dir = "js"


# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed
# Development
#output_style = :expanded
#environment = :production

# Production
output_style = :compressed
# environment = :production

# To enable relative paths to assets via compass helper functions. Uncomment:
# relative_assets = true

# Busting the cache via path:
#asset_cache_buster do |path, real_path|
#  if File.exists?(real_path)
#    pathname = Pathname.new(path)
#    modified_time = File.mtime(real_path).strftime("%s")
#    new_path = "%s/%s-%s%s" % [pathname.dirname, pathname.basename(pathname
# .extname), modified_time, pathname.extname]

#    {:path => new_path, :query => nil}
#  end
#end

# Increment the deploy_version before every release to force cache busting.
deploy_version = 1
asset_cache_buster do |http_path, real_path|
  if File.exists?(real_path)
    File.mtime(real_path).strftime("%s")
  else
    "v=#{deploy_version}"
  end
end

# To disable debugging comments that display the original location of your selectors. Uncomment:
# line_comments = false


# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass

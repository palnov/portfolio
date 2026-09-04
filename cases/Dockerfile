FROM nginx:1.27-alpine

# This image is built from the repository root in Coolify.  The existing
# project files are copied as-is so the previews keep their original design
# and relative assets.
COPY ["cases/nginx.conf", "/etc/nginx/conf.d/default.conf"]
COPY ["cases/index.html", "/usr/share/nginx/html/index.html"]

COPY ["ЖК/", "/usr/share/nginx/html/residence/"]
COPY ["aura-furniture/", "/usr/share/nginx/html/aura/"]
COPY ["caffe/", "/usr/share/nginx/html/buro/"]
COPY ["bakery/", "/usr/share/nginx/html/bakery/"]
COPY ["brewdom/", "/usr/share/nginx/html/brewdom/"]
COPY ["glamping/", "/usr/share/nginx/html/glamping/"]
COPY ["dentist/", "/usr/share/nginx/html/dentist/"]
COPY ["awesomesite/", "/usr/share/nginx/html/aion/"]
COPY ["bfl/", "/usr/share/nginx/html/bfl/"]

# These two previews are standalone HTML files.  Keep their local asset
# directories next to the HTML entrypoint.
COPY ["previews/adventure.html", "/usr/share/nginx/html/adventure/index.html"]
COPY ["previews/assets/adventure/", "/usr/share/nginx/html/adventure/assets/adventure/"]
COPY ["previews/detailing-studio.html", "/usr/share/nginx/html/detailing/index.html"]
COPY ["previews/assets/detailing/", "/usr/share/nginx/html/detailing/assets/detailing/"]

# detailing-studio.html references these original public images with a
# ../detailing-studio/public/... URL.  Preserve that path in the image so
# those references continue to work inside /cases/detailing/.
COPY ["detailing-studio/public/", "/usr/share/nginx/html/detailing-studio/public/"]

# MATERIA is a built Vite preview.  Its HTML used root-absolute /assets URLs,
# which would escape the /cases/materia/ prefix, so make only those two entry
# point references relative at image build time.
COPY ["renavation/dist/", "/usr/share/nginx/html/materia/"]
RUN sed -i \
    -e 's#src="/assets/#src="assets/#g' \
    -e 's#href="/assets/#href="assets/#g' \
    /usr/share/nginx/html/materia/index.html

EXPOSE 80

from easy_pdf.views import PDFTemplateView


class PDFExportMixin(PDFTemplateView):
    """
    PDFExportMixin
        This class is used to export all the transfer receipts in PDF format. Here we inherit
        PDFTemplateView to add response header.
        Inherits : 'PDFTemplateView'

    """

    def get(self, request, *args, **kwargs):
        """
        Handles GET request and returns HTTP response.
        """
        response = super().get(request, *args, **kwargs)
        response['Access-Control-Expose-Headers'] = 'Content-Disposition'
        return response
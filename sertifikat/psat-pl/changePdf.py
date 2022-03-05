import sys
import os

from pdfrw import PdfReader, PdfWriter



# fileIn = 'perubahan-15-63-TES8.pdf'
# fileOut = 'bar.pdf'


inpfn, = 'perubahan-15-63-TES8.pdf'
outfn = 'alter.' + os.path.basename(inpfn)

trailer = PdfReader(inpfn)
trailer.Info.Title = 'My New Title Goes Here'
trailer.Info.Producer = "My Producer";
trailer.Info.Author = "My Author";
trailer.Info.Creator = "My Creator";
trailer.Info.Subject = "My Subject";
trailer.Info.Keywords = "My Keywords";
trailer.Info.CreationDate = 'D:20150803195603Z';
trailer.Info.ModDate = 'D:20150803195603Z';
PdfWriter(outfn, trailer=trailer).write()
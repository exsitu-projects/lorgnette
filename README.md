# Lorgnette

Lorgnette is a framework for augmenting code editors with _malleable code projections_, i.e., alternative representations that are bidirectionally linked to pieces of code (or even runtime data!) and can be created and modified by the users of the code editor.
Lorgnette is a research prototype, currently targeting code editors that run in webpages, such as the [Monaco editor](https://microsoft.github.io/monaco-editor/) and [CodeMirror](https://codemirror.net/).

<p align="center">
  <img src="./misc/lorgnette-markdown-table-demo.gif" />
</p>





## Usage

TODO.



## Development

TODO.



## Publication and credit

Lorgnette was developed by Camille Gobert as part of his Ph.D. in the [ex)situ](https://ex-situ.lri.fr/) team at Inria and Paris-Saclay university.
If you are interested in reading more about Lorgnette and the motivations behind this work, check out the following publication:

> [**Lorgnette: Creating Malleable Code Projections**](https://doi.org/10.1145/3586183.3606817)
> (Gobert & Beaudouin-Lafon, UIST 2023).

To cite Lorgnette, please cite the publication above.
You can use the following BibTeX entry:

```tex
@inproceedings{gobert2023lorgnette,
  author = {Gobert, Camille and Beaudouin-Lafon, Michel},
  title = {Lorgnette: Creating Malleable Code Projections},
  year = {2023},
  booktitle = {Proceedings of the 36th Annual ACM Symposium on User Interface Software and Technology},
  articleno = {71},
  numpages = {16},
  keywords = {Projection, Semantic interaction, Lorgnette},
  location = {San Francisco, CA, USA},
  series = {UIST '23}
  publisher = {ACM},
  address = {New York, NY, USA},
  url = {https://doi.org/10.1145/3586183.3606817},
  doi = {10.1145/3586183.3606817},
}
```



## License

The code of Lorgnette is released under the MIT license.
You can freely use and adapt it, and we'd be glad to hear about it if you do!

However, keep in mind that the licenses of some of Lorgnette's dependencies may be more restrictive, especially regarding some of the React components used to create user interfaces for projections. If this matters to you, be sure to check the licences of the dependencies listed in [`package.json`](./package.json).

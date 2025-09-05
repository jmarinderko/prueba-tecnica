import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ProductService } from "../services/product.service";
import { Product } from "../models/product.interface";
import { BehaviorSubject } from "rxjs";


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent  implements OnInit {
  loading = false;

  products$ = new BehaviorSubject<Product[]>([]);
  @ViewChild('addProductTpl') addProductTpl!: TemplateRef<any>;
  form = this.fb.nonNullable.group({
    id: [0],
    name: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(1)]],
    stock: [0, [Validators.required, Validators.min(1)]],
  });


  constructor(private fb: FormBuilder,
    private modal: NgbModal,
    private productSrv: ProductService) {

   }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.loading = true;
    this.productSrv.getProducts().subscribe({
      next: (products) => {
        this.products$.next(products);
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  openModal(): void {
    this.form.reset();
    this.modal.open(this.addProductTpl);
  }

  newProduct(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const newProduct: Product = this.form.getRawValue();
    this.productSrv.newProduct(newProduct).subscribe({
      next: (product) => {
        this.products$.next([...this.products$.value, product]);
        this.form.reset();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this.modal.dismissAll();
      }
    });
  }

  deleteProduct(id: number): void {
    this.loading = true;
    this.productSrv.deleteProduct(id).subscribe({
      next: () => {
        this.products$.next(this.products$.value.filter((product) => product.id !== id));
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }


}

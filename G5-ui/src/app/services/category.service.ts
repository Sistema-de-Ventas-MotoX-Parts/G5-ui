import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Category } from '../models/category';


@Injectable({
  providedIn:'root'
})
export class CategoryService {


private apiUrl =
'http://localhost:8080/api/categorias';



constructor(
  private http:HttpClient,
){}





private getHeaders(){


  const sesion =
    localStorage.getItem('sesion');


  if(!sesion){

    return new HttpHeaders();

  }


  const usuario =
    JSON.parse(sesion);



  return new HttpHeaders({

    Authorization:`Bearer ${usuario.token}`

  });


}






getCategories():Observable<Category[]>{


  return this.http.get<Category[]>(

    this.apiUrl,

    {
      headers:this.getHeaders()
    }

  );


}





createCategory(
 categoria:Category
):Observable<Category>{


 return this.http.post<Category>(

  this.apiUrl,

  categoria,

  {
    headers:this.getHeaders()
  }

 );


}






updateCategory(
 id:number,
 categoria:Category
):Observable<Category>{


 return this.http.put<Category>(

  `${this.apiUrl}/${id}`,

  categoria,

  {
    headers:this.getHeaders()
  }

 );


}







deleteCategory(
 id:number
):Observable<void>{


 return this.http.delete<void>(

  `${this.apiUrl}/${id}`,

  {
    headers:this.getHeaders()
  }

 );


}



}

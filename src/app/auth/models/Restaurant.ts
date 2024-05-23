import { StringMappingType } from "typescript";
import {Menu} from "./Menu"
export class Restaurant{
    id: number;
    name:string;
    place:string;
    logo:string;
    menus ?:Menu[]

}
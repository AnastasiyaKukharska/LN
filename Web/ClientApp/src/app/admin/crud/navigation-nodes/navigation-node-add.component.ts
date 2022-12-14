import { Component, Inject, ViewChild, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Floor, MapComponent } from '../../../map/map.component';
import { LectureRoomService } from '../../../services/lecture-room.service'
import { LectureRoom } from '../../../dto/lectrure-room.dto'
import { v4 as uuidv4 } from 'uuid'
import { Faculty } from '../../../dto/faculty.dto';
import { FacultyService } from '../../../services/faculty.service';
import { NavigationNode } from '../../../dto/navigation-node.dto';
import { NavigationNodeService } from '../../../services/navigation-node.service';

@Component({
  selector: 'navigation-node-add',
  templateUrl: './navigation-node-add.component.html',
  styleUrls: ['./navigation-node-add.component.css'],
  providers: [NavigationNodeService]
})
export class NavigationNodeAddComponent {
  selectedOption: string = '';
  floors: any[] = [
    { value: 0, viewValue: 'Basement' },
    { value: 1, viewValue: 'First' },
    { value: 2, viewValue: 'Second' },
    { value: 3, viewValue: 'Third' },
    { value: 4, viewValue: 'Fourth' },
  ];

  public navigation_nodes: NavigationNode[] = [];

  public to_add_node: NavigationNode;

  current_floor: number = Floor.FirstFloor;
  readonly show_nodes: boolean = true;
  data_ready: boolean = false;
  click_coordinates: number[] = [];

  private UpdateNavigatioNodes() {
    this.navigation_node_service.getAll().subscribe(results => {
      this.navigation_nodes = results;
      this.data_ready = true;
    }, err => { console.error(err); });

  }

  constructor(
    private navigation_node_service: NavigationNodeService,) {
    this.to_add_node = new NavigationNode;
  }

  ngOnInit(): void {
    this.UpdateNavigatioNodes();
    this.to_add_node.floor = this.current_floor;
  }

  setFloor(value: string) {
    this.current_floor = Number(value);
    this.to_add_node.floor = this.current_floor;
    this.to_add_node.x = 0;
    this.to_add_node.y = 0;
  }

  ChildEventHandler(value: number[]) {
    this.to_add_node.x = value[0];
    this.to_add_node.y = value[1];
  }
  sumbit() {
    this.to_add_node.id = uuidv4();
    console.log(this.to_add_node);
    this.navigation_node_service.addOne(this.to_add_node).subscribe(finish => { this.UpdateNavigatioNodes(); }, err => { console.log(err); });
  }

}

import { WidgetType } from "./widget-enum";

export class FlatWidgetData {
    type: WidgetType = WidgetType.PV;
    data: {key: string, value: unknown}[] = [{key: '', value: null}];
    source = "";
}

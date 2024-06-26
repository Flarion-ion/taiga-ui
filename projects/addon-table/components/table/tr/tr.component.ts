import {AsyncPipe, NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';
import type {AfterContentInit, QueryList} from '@angular/core';
import {
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    forwardRef,
    inject,
} from '@angular/core';
import {EMPTY_QUERY, tuiQueryListChanges} from '@taiga-ui/cdk';
import {map, ReplaySubject, switchMap} from 'rxjs';

import {TuiTableCell} from '../directives/cell.directive';
import {TuiTableDirective} from '../directives/table.directive';
import {TUI_TABLE_PROVIDER} from '../providers/table.provider';
import {TuiTableTbody} from '../tbody/tbody.component';
import {TuiTableTd} from '../td/td.component';

@Component({
    standalone: true,
    selector: 'tr[tuiTr]',
    imports: [NgIf, AsyncPipe, NgForOf, NgTemplateOutlet, TuiTableTd],
    templateUrl: './tr.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TUI_TABLE_PROVIDER],
})
export class TuiTableTr<T extends Partial<Record<keyof T, any>>>
    implements AfterContentInit
{
    @ContentChildren(forwardRef(() => TuiTableCell))
    private readonly cells: QueryList<TuiTableCell> = EMPTY_QUERY;

    private readonly body = inject<TuiTableTbody<T>>(forwardRef(() => TuiTableTbody));

    private readonly contentReady$ = new ReplaySubject<boolean>(1);

    protected readonly table = inject<TuiTableDirective<T>>(
        forwardRef(() => TuiTableDirective),
    );

    protected readonly cells$ = this.contentReady$.pipe(
        switchMap(() => tuiQueryListChanges(this.cells)),
        map(cells =>
            cells.reduce(
                (record, item) => ({...record, [item.tuiCell]: item}),
                {} as Record<string | keyof T, TuiTableCell>,
            ),
        ),
    );

    protected readonly item$ = this.contentReady$.pipe(
        switchMap(() => tuiQueryListChanges(this.body.rows)),
        map(
            rows =>
                /**
                 * TODO v4.0 replace `this.body.sorted` with `this.body.data` (don't forget to drop `sorted`-getter).
                 */
                this.body.sorted[rows.findIndex(row => row === this)] as Record<
                    string | keyof T,
                    any
                >,
        ),
    );

    public async ngAfterContentInit(): Promise<void> {
        await Promise.resolve();
        this.contentReady$.next(true);
    }
}

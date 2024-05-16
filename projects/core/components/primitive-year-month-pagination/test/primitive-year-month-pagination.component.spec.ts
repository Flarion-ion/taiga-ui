import type {DebugElement} from '@angular/core';
import {Component, ViewChild} from '@angular/core';
import type {ComponentFixture} from '@angular/core/testing';
import {TestBed} from '@angular/core/testing';
import type {TuiYear} from '@taiga-ui/cdk';
import {TuiMonth} from '@taiga-ui/cdk';
import {TuiPageObject} from '@taiga-ui/testing';
import {NG_EVENT_PLUGINS} from '@tinkoff/ng-event-plugins';

import {TuiPrimitiveYearMonthPaginationComponent} from '../primitive-year-month-pagination.component';
import {TuiPrimitiveYearMonthPaginationModule} from '../primitive-year-month-pagination.module';

describe('PrimitiveYearMonthPaginationComponent', () => {
    @Component({
        template: `
            <tui-primitive-year-month-pagination
                [max]="max"
                [min]="min"
                [(value)]="value"
            ></tui-primitive-year-month-pagination>
        `,
    })
    class TestComponent {
        @ViewChild(TuiPrimitiveYearMonthPaginationComponent)
        public readonly component!: TuiPrimitiveYearMonthPaginationComponent;

        public min = new TuiMonth(1900, 6);

        public max = new TuiMonth(2100, 6);

        public value = new TuiMonth(2000, 6);
    }

    let fixture: ComponentFixture<TestComponent>;
    let testComponent: TestComponent;
    let pageObject: TuiPageObject<TestComponent>;
    let component: TuiPrimitiveYearMonthPaginationComponent;
    const testContext = {
        get prefix() {
            return 'tui-primitive-year-month-pagination__';
        },
    };

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [TuiPrimitiveYearMonthPaginationModule],
            declarations: [TestComponent],
            providers: [NG_EVENT_PLUGINS],
        });
        await TestBed.compileComponents();
        fixture = TestBed.createComponent(TestComponent);
        pageObject = new TuiPageObject(fixture);
        testComponent = fixture.componentInstance;
        fixture.detectChanges();
        component = testComponent.component;
    });

    function getYearButton(): DebugElement {
        return pageObject.getByAutomationId(`${testContext.prefix}year-button`)!;
    }

    describe('init', () => {
        it('value', () => {
            expect(component.value).toBe(testComponent.value);
        });

        it('min', () => {
            expect(component.min).toBe(testComponent.min);
        });

        it('max', () => {
            expect(component.max).toBe(testComponent.max);
        });
    });

    describe('getter', () => {
        describe('prevMonthDisabled', () => {
            it('true if min is bigger than value', () => {
                component.min = new TuiMonth(3000, 0);
                fixture.detectChanges();
                expect(component.prevMonthDisabled).toBe(true);
            });

            describe('false if', () => {
                it('min is smaller than value', () => {
                    expect(component.prevMonthDisabled).toBe(false);
                });
            });
        });

        describe('nextMonthDisabled', () => {
            it('true if max is smaller than value', () => {
                component.max = new TuiMonth(1000, 0);
                fixture.detectChanges();
                expect(component.nextMonthDisabled).toBe(true);
            });

            describe('false if', () => {
                it('max is bigger than value', () => {
                    expect(component.nextMonthDisabled).toBe(false);
                });
            });
        });
    });

    describe('method', () => {
        describe('onPrevMonthClick', () => {
            it('decreases value', () => {
                component.onPrevMonthClick();
                expect(testComponent.value.toJSON()).toBe('2000-06');
            });

            it('does not change if value equals to min', () => {
                testComponent.min = new TuiMonth(2000, 6);
                fixture.detectChanges();
                component.onPrevMonthClick();
                expect(testComponent.value.toJSON()).toBe(testComponent.min.toJSON());
            });
        });

        describe('onNextMonthClick', () => {
            describe('increases value if', () => {
                it('date in value is bigger than max', () => {
                    component.onNextMonthClick();
                    expect(testComponent.value.toJSON()).toBe('2000-08');
                });
            });

            it('does not change if value equals to max', () => {
                testComponent.max = new TuiMonth(2000, 6);
                fixture.detectChanges();
                component.onNextMonthClick();
                expect(testComponent.value.toJSON()).toBe(testComponent.max.toJSON());
            });
        });
    });

    describe('year picker button', () => {
        it('is there if min and max are different years', () => {
            expect(getYearButton()).not.toBeNull();
        });

        it('is not there if min year equals to max year', () => {
            testComponent.max = new TuiMonth(1900, 11);
            fixture.detectChanges();

            expect(getYearButton()).toBeNull();
        });
    });

    it('emits value by year click', () => {
        const month = new TuiMonth(2019, 10);

        component.value = month;

        component.yearClick.subscribe((clickedYear: TuiYear) => {
            expect(clickedYear).toBe(month);
        });

        component.onYearClick();
    });
});
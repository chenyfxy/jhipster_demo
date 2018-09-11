import { browser, ExpectedConditions as ec, protractor } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { EntryComponentsPage, EntryDeleteDialog, EntryUpdatePage } from './entry.page-object';

describe('Entry e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let entryUpdatePage: EntryUpdatePage;
    let entryComponentsPage: EntryComponentsPage;
    let entryDeleteDialog: EntryDeleteDialog;

    beforeAll(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Entries', async () => {
        await navBarPage.goToEntity('entry');
        entryComponentsPage = new EntryComponentsPage();
        expect(await entryComponentsPage.getTitle()).toMatch(/blogApp.entry.home.title/);
    });

    it('should load create Entry page', async () => {
        await entryComponentsPage.clickOnCreateButton();
        entryUpdatePage = new EntryUpdatePage();
        expect(await entryUpdatePage.getPageTitle()).toMatch(/blogApp.entry.home.createOrEditLabel/);
        await entryUpdatePage.cancel();
    });

    it('should create and save Entries', async () => {
        await entryComponentsPage.clickOnCreateButton();
        await entryUpdatePage.setTitleInput('title');
        expect(await entryUpdatePage.getTitleInput()).toMatch('title');
        await entryUpdatePage.setContentInput('content');
        expect(await entryUpdatePage.getContentInput()).toMatch('content');
        await entryUpdatePage.setDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
        expect(await entryUpdatePage.getDateInput()).toContain('2001-01-01T02:30');
        await entryUpdatePage.blogSelectLastOption();
        // entryUpdatePage.tagSelectLastOption();
        await entryUpdatePage.save();
        expect(await entryUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    it('should delete last Entry', async () => {
        const nbButtonsBeforeDelete = await entryComponentsPage.countDeleteButtons();
        await entryComponentsPage.clickOnLastDeleteButton();

        entryDeleteDialog = new EntryDeleteDialog();
        expect(await entryDeleteDialog.getDialogTitle()).toMatch(/blogApp.entry.delete.question/);
        await entryDeleteDialog.clickOnConfirmButton();

        expect(await entryComponentsPage.countDeleteButtons()).toBe(nbButtonsBeforeDelete - 1);
    });

    afterAll(async () => {
        await navBarPage.autoSignOut();
    });
});

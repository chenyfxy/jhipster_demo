import { browser, ExpectedConditions as ec } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { BlogComponentsPage, BlogDeleteDialog, BlogUpdatePage } from './blog.page-object';

describe('Blog e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let blogUpdatePage: BlogUpdatePage;
    let blogComponentsPage: BlogComponentsPage;
    let blogDeleteDialog: BlogDeleteDialog;

    beforeAll(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Blogs', async () => {
        await navBarPage.goToEntity('blog');
        blogComponentsPage = new BlogComponentsPage();
        expect(await blogComponentsPage.getTitle()).toMatch(/blogApp.blog.home.title/);
    });

    it('should load create Blog page', async () => {
        await blogComponentsPage.clickOnCreateButton();
        blogUpdatePage = new BlogUpdatePage();
        expect(await blogUpdatePage.getPageTitle()).toMatch(/blogApp.blog.home.createOrEditLabel/);
        await blogUpdatePage.cancel();
    });

    it('should create and save Blogs', async () => {
        await blogComponentsPage.clickOnCreateButton();
        await blogUpdatePage.setNameInput('name');
        expect(await blogUpdatePage.getNameInput()).toMatch('name');
        await blogUpdatePage.setHandleInput('handle');
        expect(await blogUpdatePage.getHandleInput()).toMatch('handle');
        await blogUpdatePage.userSelectLastOption();
        await blogUpdatePage.save();
        expect(await blogUpdatePage.getSaveButton().isPresent()).toBeFalsy();
    });

    it('should delete last Blog', async () => {
        const nbButtonsBeforeDelete = await blogComponentsPage.countDeleteButtons();
        await blogComponentsPage.clickOnLastDeleteButton();

        blogDeleteDialog = new BlogDeleteDialog();
        expect(await blogDeleteDialog.getDialogTitle()).toMatch(/blogApp.blog.delete.question/);
        await blogDeleteDialog.clickOnConfirmButton();

        expect(await blogComponentsPage.countDeleteButtons()).toBe(nbButtonsBeforeDelete - 1);
    });

    afterAll(async () => {
        await navBarPage.autoSignOut();
    });
});

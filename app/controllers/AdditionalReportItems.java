package controllers;

import models.AdditionalReportItem;
import models.Metric;
import models.Report;
import models.ValueAddedTaxRate;
import play.data.validation.Valid;
import play.data.validation.Validation;
import play.i18n.Messages;
import util.i18n.CurrencyProvider;

public class AdditionalReportItems extends ApplicationController {
    public static void create(Long reportId) {
        notFoundIfNull(reportId);
        Report report = Report.findById(reportId);
        notFoundIfNull(report);

        AdditionalReportItem additionalReportItem = new AdditionalReportItem();
        additionalReportItem.report = report;

        initRenderArgs();
        render("@form", additionalReportItem);
    }

    public static void save(@Valid AdditionalReportItem additionalReportItem) {
        if(Validation.hasErrors()) {
            initRenderArgs();
            render("@form", additionalReportItem);
        }

        additionalReportItem.save();
        flash.success(Messages.get("successfullySaved", Messages.get("additionalReportItem")));
        Reports.show(additionalReportItem.report.id);
    }

    private static void initRenderArgs() {
        renderArgs.put("metrics", Metric.findAll());
        renderArgs.put("defaultCurrency", CurrencyProvider.getDefaultCurrency());
        renderArgs.put("valueAddedTaxRates", ValueAddedTaxRate.findAll());
    }
}
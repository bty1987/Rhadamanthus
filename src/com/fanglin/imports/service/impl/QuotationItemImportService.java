package com.fanglin.imports.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.po.MeasurementUnitPO;
import com.fanglin.communion.po.QuotationBigCategoryPO;
import com.fanglin.communion.po.QuotationClassificationPO;
import com.fanglin.communion.po.QuotationSmallCategoryPO;
import com.fanglin.communion.po.QuotationTypePO;
import com.fanglin.communion.po.WorkTypePO;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.quotation.dao.QuotationItemDao;
import com.fanglin.utils.Arith;

@Service("quotationItemImportService")
@Transactional(readOnly = true)
public class QuotationItemImportService implements com.fanglin.imports.service.QuotationItemImportService {

	@Autowired
	private QuotationItemDao quotationItemDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void importQuotationItem(List<List<String>> excels, String userId) {

		int index = 1;

		for (int i = 1; i < excels.size(); i++) {

			List<String> _quoitem = excels.get(i);
			String itemId = _quoitem.get(1);
			String versionId = _quoitem.get(2);
			String itemName = _quoitem.get(3);

			int quoType = Double.valueOf(_quoitem.get(4)).intValue();
			int quoClass = Double.valueOf(_quoitem.get(5)).intValue();
			int bigCategory = Double.valueOf(_quoitem.get(6)).intValue();
			int smallCategory = Double.valueOf(_quoitem.get(7)).intValue();
			int measurementUnitId = Double.valueOf(_quoitem.get(8)).intValue();
			int workId = Double.valueOf(_quoitem.get(9)).intValue();

			String quotationItemDes = _quoitem.get(10);

			int addPrice = Arith.mul(Double.valueOf(_quoitem.get(11)).intValue(), 1000);
			int unitPrice = Arith.mul(Double.valueOf(_quoitem.get(12)).intValue(), 1000);
			int subPrice = Arith.mul(Double.valueOf(_quoitem.get(13)).intValue(), 1000);
			short status = Double.valueOf(_quoitem.get(14)).shortValue();
			short discount = Double.valueOf(_quoitem.get(15)).shortValue();

			QuotationItemPO quoItem = new QuotationItemPO();

			quoItem.setNo(itemId);
			quoItem.setQuotationVersion(new QuotationVersionPO(versionId));
			quoItem.setName(itemName);
			quoItem.setQuotationType(new QuotationTypePO(quoType));
			quoItem.setQuotationClassification(new QuotationClassificationPO(quoClass));
			quoItem.setQuotationBigCategory(new QuotationBigCategoryPO(bigCategory));
			quoItem.setQuotationSmallCategory(new QuotationSmallCategoryPO(smallCategory));
			quoItem.setMeasurementUnit(new MeasurementUnitPO(measurementUnitId));
			quoItem.setWorkType(new WorkTypePO(workId));
			quoItem.setAddPrice(addPrice);
			quoItem.setUnitPrice(unitPrice);
			quoItem.setSubPrice(subPrice);
			quoItem.setStatus(status);
			quoItem.setDiscount(discount);
			quoItem.setComment(quotationItemDes);

			quotationItemDao.save(quoItem);

			index++;

			if (index % 50 == 0) {
				quotationItemDao.flush();
			}
		}
	}
}

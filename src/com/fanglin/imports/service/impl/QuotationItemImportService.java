package com.fanglin.imports.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.data.po.MeasurementUnitPO;
import com.fanglin.data.po.QuotationBigCategoryPO;
import com.fanglin.data.po.QuotationClassificationPO;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.po.QuotationSmallCategoryPO;
import com.fanglin.data.po.QuotationTypePO;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.po.WorkTypePO;
import com.fanglin.data.quotation.dao.QuotationItemDao;

@Service("quotationItemImportService")
@Transactional(readOnly=true)
public class QuotationItemImportService implements com.fanglin.imports.service.QuotationItemImportService{
	
	@Autowired
	private QuotationItemDao quotationItemDao;
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void importQuotationItem(List<List<String>> excels, String userId) {
		
		int index = 1;
		
		for(int i = 1; i < excels.size(); i++){
			
			List<String> _quoitem = excels.get(i);
			String itemId = _quoitem.get(1);
			String versionId = _quoitem.get(2);
			String itemName = _quoitem.get(3);
			int quoType = (int)Double.parseDouble(_quoitem.get(4));
			int quoClass  = (int)Double.parseDouble(_quoitem.get(5));
			int bigCategory = (int)Double.parseDouble(_quoitem.get(6));
			int smallCategory = (int)Double.parseDouble(_quoitem.get(7));
			int measurementUnitId = (int)Double.parseDouble(_quoitem.get(8));
			int workId = (int)Double.parseDouble(_quoitem.get(9));
			String quotationItemDes = _quoitem.get(10);
			float unitPrice = Float.parseFloat(_quoitem.get(11));
			short status = (short)Double.parseDouble(_quoitem.get(12));
			short discount = (short)Double.parseDouble(_quoitem.get(13));
			
			QuotationItemPO quoItem = new QuotationItemPO();
			quoItem.setItemId(itemId);
			quoItem.setQuotationVersion(new QuotationVersionPO(versionId));
			quoItem.setItemName(itemName);
			quoItem.setQuotationType(new QuotationTypePO(quoType));
			quoItem.setQuotationClassification(new QuotationClassificationPO(quoClass));
			quoItem.setQuotationBigCategory(new QuotationBigCategoryPO(bigCategory));
			quoItem.setQuotationSmallCategory(new QuotationSmallCategoryPO(smallCategory));
			quoItem.setMeasurementUnit(new MeasurementUnitPO(measurementUnitId));
			quoItem.setWorkType(new WorkTypePO(workId));
			quoItem.setQuotationItemDes(quotationItemDes);
			quoItem.setUnitPrice(unitPrice);
			quoItem.setStatus(status);
			quoItem.setDiscount(discount);
			
			quotationItemDao.save(quoItem);
			
			index++;
			
			if(index % 50 == 0){
				quotationItemDao.flush();
			}
		}
	}
}

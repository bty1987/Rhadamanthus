package com.fanglin.payment.dao.impl;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.dao.ReceiptDao;
import com.fanglin.payment.po.ReceiptPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("receiptDao")
public class ReceiptDaoImpl extends DaoImpl<ReceiptPO> implements ReceiptDao {

	public ReceiptDaoImpl(){
		super(ReceiptPO.class);
	}

	@Override
	public List<ReceiptPO> pageReceipt(Paging paging, List<Filter> filters, int company) {
		
		filters.add(new Filter("company", String.valueOf(company), "eq"));
		
		PagingQuery<ReceiptPO> query = pagingQuery(paging, ReceiptPO.class);
		
		if(filters != null){
			for (Filter filter : filters) {
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(field.equals("paymentType")){
					query.add(query.getCriterion(field, Short.valueOf(data), op));
				}else if(field.equals("receiptType")){
					query.add(query.getCriterion(field, Short.valueOf(data), op));
				}else if(field.equals("company")){
					query.add(query.getCriterion(field, Integer.valueOf(data), op));
				}else if(field.equals("collectTime")){
					if("between".equals(filter.getOp())){
						String sTime = filter.getData().split("-")[0].replaceAll("/", "-") + " 00:00:00";
						String eTime = filter.getData().split("-")[1].replaceAll("/", "-") + " 23:59:59";
						
						Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
						Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
						
						Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
						Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
						
						query.add(query.getCriterion("collectTime", eTimestamp, "le"));
						query.add(query.getCriterion("collectTime", sTimestamp, "ge"));
					}
				}
			}	
		}
		
		return query.list();
	}

}

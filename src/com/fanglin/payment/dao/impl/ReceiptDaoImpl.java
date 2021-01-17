package com.fanglin.payment.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.dao.ReceiptDao;
import com.fanglin.payment.po.ReceiptPO;
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
						query.timeranges("collectTime", "collectTime", filter.getData());
					}
				}
			}	
		}
		
		return query.list();
	}

}

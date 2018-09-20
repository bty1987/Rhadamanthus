/**
 * @File Name		: MaterialPaymentDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.dao.impl;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.material.po.MaterialPO;
import com.fanglin.payment.dao.MaterialPaymentDao;
import com.fanglin.payment.po.MaterialPaymentPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("materialPaymentDao")
public class MaterialPaymentDaoImpl extends DaoImpl<MaterialPaymentPO> implements MaterialPaymentDao {
	
	public MaterialPaymentDaoImpl(){
		super(MaterialPaymentPO.class);
	}
	
	@Override
	public List<MaterialPaymentPO> pageMaterialPayment(Paging paging, List<Filter> filters){
		
		PagingQuery<MaterialPaymentPO> query = pagingQuery(paging, MaterialPaymentPO.class);
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}
	
	@Override
	public List<MaterialPaymentPO> pageMaterialPaymentForStatus(Paging paging, List<Filter> filters, Short status, String op) {
		
		PagingQuery<MaterialPaymentPO> query = pagingQuery(paging, MaterialPaymentPO.class);
		
		query.add(query.getCriterion(MaterialPaymentPO.COLUMN_PAYMENTSTATUS_STR, status, op));
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	public List<MaterialPaymentPO> queryMaterialPayment(List<Filter> filters){
		
		PagingQuery<MaterialPaymentPO> query = pagingQuery(new Paging(), MaterialPaymentPO.class);
		
		queryFilterExcute(query, filters);
		
		query.notPaging();
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialPaymentPO> queryMaterialPaymentByOrderId(String orderId) {
		return session().createCriteria(MaterialPaymentPO.class).createAlias("material", "material").add(Restrictions.eq("material.orderId", orderId)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialPaymentPO> queryMaterialPaymentByMid(long mid, Short paymentStatus){
		
		Criteria query = session().createCriteria(MaterialPaymentPO.class).createAlias("material", "material").add(Restrictions.eq("material.mid", mid));
		
		if(paymentStatus != null){
			query.add(Restrictions.eq(MaterialPaymentPO.COLUMN_PAYMENTSTATUS_STR, paymentStatus));
		}
		
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialPaymentPO> queryMaterialPaymentByMids(List<Long> mids) {
		return session().createCriteria(MaterialPaymentPO.class).createAlias("material", "material").add(Restrictions.in("material.mid", mids)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialPaymentPO> queryMaterialPaymentByMidAType(long mid, Short paymentType){
		Criteria query = session().createCriteria(MaterialPaymentPO.class).createAlias("material", "material").add(Restrictions.eq("material.mid", mid));
		
		if(paymentType != null){
			query.add(Restrictions.eq(MaterialPaymentPO.COLUMN_PAYMENTTYPE_STR, paymentType));
		}
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialPaymentPO> queryMaterialPaymentByMidATypeAStatus(long mid, Short paymentType, Short paymentStatus) {
		
		Criteria query = session().createCriteria(MaterialPaymentPO.class).createAlias("material", "material").add(Restrictions.eq("material.mid", mid));
		
		if(paymentType != null){
			query.add(Restrictions.eq(MaterialPaymentPO.COLUMN_PAYMENTTYPE_STR, paymentType));
		}
		
		if(paymentStatus != null){
			query.add(Restrictions.eq(MaterialPaymentPO.COLUMN_PAYMENTSTATUS_STR, paymentStatus));
		}
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked") 
	public List<MaterialPaymentPO> queryMaterialPaymentForNotInitByMid(long mid){
		return session().createCriteria(MaterialPaymentPO.class).createAlias("material", "material")
				.add(Restrictions.eq("material.mid", mid))
				.add(Restrictions.ne(MaterialPaymentPO.COLUMN_PAYMENTSTATUS_STR, MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT))
				.list();
	}
	
	@Override
	@SuppressWarnings("unchecked") 
	public List<MaterialPaymentPO> queryMaterialPaymentForInitByMid(long mid) {
		return session().createCriteria(MaterialPaymentPO.class).createAlias("material", "material")
				.add(Restrictions.eq("material.mid", mid))
				.add(Restrictions.eq(MaterialPaymentPO.COLUMN_PAYMENTSTATUS_STR, MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT))
				.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialPaymentPO> queryMaterialPaymentForNotInitByMrId(long mrId) {
		return session().createCriteria(MaterialPaymentPO.class).createAlias("materialReceipt", "materialReceipt").add(Restrictions.eq("materialReceipt.mrId", mrId)).add(Restrictions.ne(MaterialPaymentPO.COLUMN_PAYMENTSTATUS_STR, MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialPaymentPO> queryMaterialPaymentByReceiptId(long mrId) {
		return session().createCriteria(MaterialPaymentPO.class).createAlias("materialReceipt", "materialReceipt").add(Restrictions.eq("materialReceipt.mrId", mrId)).list();
	}
	
	@Override
	public MaterialPaymentPO queryMaterialPaymentByMsoNoAType(String msoNo, Short paymentType){
		return (MaterialPaymentPO) session().createCriteria(MaterialPaymentPO.class).createAlias("material", "material")
				.add(Restrictions.eq(MaterialPaymentPO.COLUMN_NO_STR, msoNo))
				.add(Restrictions.eq(MaterialPaymentPO.COLUMN_PAYMENTTYPE_STR, paymentType))
				.uniqueResult();
	}
	
	@Override
	public int countMaterialPaymentByMidAType(long mid, Short paymentType) {

		String sql = "select count(*) from payment.materialpayment where mid =:mid and paymentType =:paymentType";
		BigInteger num = (BigInteger)session().createSQLQuery(sql).setLong("mid", mid).setInteger("paymentType", paymentType).uniqueResult();
		return num.intValue();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		query.alias("material", "material");
		query.alias("material.house", "house");
		query.alias("house.village", "village");
		query.alias("material.salesman", "salesman");
		
		if(filters != null){
			for(Filter filter: filters){
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(MaterialPaymentPO.COLUMN_ORDERID_STR.equals(field)){
					query.add(query.getCriterion("material.orderId", data, op));
				}else if("villageName".equals(field)){
					query.add(query.getCriterion("village.no", filter.getData(), filter.getOp()));
				}else if(MaterialPO.COLUMN_NO_STR.equals(field)){
					query.add(query.getCriterion("material.no", data, op));
				}else if(MaterialPaymentPO.COLUMN_NO_STR.equals(field)){
					query.add(query.getCriterion(field, data, op));
				}else if("designer".equals(field)){
					query.add(query.getCriterion("salesman.userId", filter.getData(), filter.getOp()));
				}else if(MaterialPaymentPO.COLUMN_PAYMENTSTATUS_STR.equals(field)){
					query.add(query.getCriterion(MaterialPaymentPO.COLUMN_PAYMENTSTATUS_STR, Integer.parseInt(data), op));
				}else if(MaterialPaymentPO.COLUMN_COLLECTTIME_STR.equals(field)){
					query.alias("materialReceipt", "materialReceipt");
					
					if("between".equals(op)){
						
						String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
						String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";
						
						Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
						Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
						
						Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
						Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
						
						query.add(query.getCriterion("materialReceipt.collectTime", eTimestamp, "le"));
						query.add(query.getCriterion("materialReceipt.collectTime", sTimestamp, "ge"));
					}else{
						query.add(query.getCriterion("materialReceipt.collectTime", data, op));
					}
				}else if("company".equals(filter.getField())){
					query.add(query.getCriterion(filter.getField(), Integer.valueOf(filter.getData()), filter.getOp()));
				}
			}
		}
	}

}

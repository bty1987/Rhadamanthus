/**
 * @File Name		: DecorationPaymentDaoImpl
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.payment.dao.impl;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("decorationPaymentDao")
public class DecorationPaymentDaoImpl extends DaoImpl<DecorationPaymentPO> implements DecorationPaymentDao {

	public DecorationPaymentDaoImpl(){
		super(DecorationPaymentPO.class);
	}
	
	@Override
	public List<DecorationPaymentPO> pageDecorationPayment(Paging paging, List<Filter> filters){
		PagingQuery<DecorationPaymentPO> query = pagingQuery(paging, DecorationPaymentPO.class);
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPaymentPO> queryDecorationPaymentByDpids(List<Long> dpids) {
		return session().createCriteria(DecorationPaymentPO.class).add(Restrictions.in("dpid", dpids)).list();
	}

	@Override
	public List<DecorationPaymentPO> pageDecorationPaymentForCollect(Paging paging, List<Filter> filters){
		PagingQuery<DecorationPaymentPO> query = pagingQuery(paging, DecorationPaymentPO.class);
		
		queryFilterExcute(query, filters);
		query.asc("createTime");
		
		return query.list();
	}
	
	@Override
	public List<DecorationPaymentPO> queryDecorationPayment(List<Filter> filters) {
		
		PagingQuery<DecorationPaymentPO> query = pagingQuery(new Paging(), DecorationPaymentPO.class);
		
		queryFilterExcute(query, filters);
		query.notPaging();
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPaymentPO> queryDecorationPaymentByOrderId(String orderId){
		return session().createCriteria(DecorationPaymentPO.class).add(Restrictions.eq("decoration.orderId", orderId)).list();
	}

	@Override
	public DecorationPaymentPO queryDecorationPaymentByOrderIdAType(String orderId, String paymentType){
		return (DecorationPaymentPO) session().createCriteria(DecorationPaymentPO.class).add(Restrictions.eq("decoration.orderId", orderId)).add(Restrictions.eq("paymentType", paymentType)).uniqueResult();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPaymentPO> queryDecorationPaymentByOrderIdAStatusAOneTypeATwoType(String orderId, String[] paymentStatus, short oneType, short twoType){
		return session().createCriteria(DecorationPaymentPO.class).add(Restrictions.eq("decoration.orderId", orderId)).add(Restrictions.in("paymentStatus", paymentStatus)).add(Restrictions.eq("oneType", oneType)).add(Restrictions.eq("twoType", twoType)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPaymentPO> queryDecorationPaymentForNotInitByDrId(long drId) {
		
		List<String> paymentStatus = Arrays.asList(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_STR);
		
		return session().createCriteria(DecorationPaymentPO.class).createAlias("decorationReceipt", "decorationReceipt").add(Restrictions.eq("decorationReceipt.drId", drId)).add(Restrictions.not(Restrictions.in("paymentStatus", paymentStatus))).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPaymentPO> queryDecorationPaymentByDrid(long drid) {
		return session().createCriteria(DecorationPaymentPO.class).createAlias("decorationReceipt", "decorationReceipt").add(Restrictions.eq("decorationReceipt.drid", drid)).list();
	}
	
	@Override
	public DecorationPaymentPO queryDecorationPaymentByOrderIdAndSort(String orderId, short sort) {
		return (DecorationPaymentPO) session().createCriteria(DecorationPaymentPO.class).add(Restrictions.eq("decoration.orderId", orderId)).add(Restrictions.eq("sort", sort)).add(Restrictions.eq("oneType", DecorationPaymentPO.ONETYPE_ADD_INT)).add(Restrictions.eq("twoType", DecorationPaymentPO.TWOTYPE_DEAL_INT)).uniqueResult();
	}

	@Override
	public int changeDecorationPaymentForOrderId(String oldOrderId, String newOrderId) {
		
		String sql = "update payment.decorationpayment set orderId=:newOrderId where orderId=:oldOrderId";
	    
	    session().createSQLQuery(sql).setString("newOrderId", newOrderId).setString("oldOrderId", oldOrderId).executeUpdate();
		
		return 0;
	}
	
	@Override
	public int deleteDecorationPaymentForBase(String orderId){
		
		String sql = "delete from payment.decorationpayment where orderId=:orderId and paymentType <> :paymentTypes and onetype = :onetype and twotype = :twotype";
	    
	    return session().createSQLQuery(sql).setString("orderId", orderId).setString("paymentTypes", DecorationPaymentPO.PAYMENTTYPE_DESIGN_STR).setInteger("onetype", DecorationPaymentPO.ONETYPE_ADD_INT).setInteger("twotype", DecorationPaymentPO.TWOTYPE_DEAL_INT).executeUpdate();
	}

	private void queryFilterExcute(PagingQuery<DecorationPaymentPO> query,List<Filter> filters){
		
		if(filters != null){
			query.alias("decoration", "order");
			query.alias("order.house", "house");
			query.alias("house.village", "village");
			query.alias("order.designer", "designer");
			
			for(Filter filter: filters){
				if(StringUtils.isNotEmpty(filter.getData())){
					if("orderId".equals(filter.getField())){
						query.add(query.getCriterion("order.orderId", filter.getData(), filter.getOp()));
					}else if("designer".equals(filter.getField())){
						query.add(query.getCriterion("designer.userId", filter.getData(), filter.getOp()));
					}else if("village".equals(filter.getField())){
						query.add(query.getCriterion("village.no", filter.getData(), filter.getOp()));
					}else if("houseNumber".equals(filter.getField())){
						query.add(query.getCriterion("house.houseNumber", filter.getData(), filter.getOp()));
					}else if("collectUser".equals(filter.getField())){
						query.alias("decorationReceipt", "decorationReceipt");
						query.alias("decorationReceipt.collecter", "collecter");
						query.add(query.getCriterion("collecter.currentName", filter.getData(), filter.getOp()));
					}else if("collectTime".equals(filter.getField())){
						
						query.alias("decorationReceipt", "decorationReceipt");
						
						if("between".equals(filter.getOp())){
							
							String sTime = filter.getData().split("-")[0].replaceAll("/", "-") + " 00:00:00";
							String eTime = filter.getData().split("-")[1].replaceAll("/", "-") + " 23:59:59";
							
							Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
							Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
							
							Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
							Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
							
							query.add(query.getCriterion("decorationReceipt.collectTime", eTimestamp, "le"));
							query.add(query.getCriterion("decorationReceipt.collectTime", sTimestamp, "ge"));
						}else{
							query.add(query.getCriterion("decorationReceipt.collectTime", filter.getData(), filter.getOp()));
						}
					}else if("paymentStatus".equals(filter.getField())){
						query.add(query.getCriterion("paymentStatus", filter.getData(), filter.getOp()));
					}else if("createTime".equals(filter.getField())){
						if("between".equals(filter.getOp())){
							
							String sTime = filter.getData().split("-")[0].replaceAll("/", "-") + " 00:00:00";
							String eTime = filter.getData().split("-")[1].replaceAll("/", "-") + " 23:59:59";
							
							Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
							Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
							
							Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
							Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
							
							query.add(query.getCriterion("createTime", eTimestamp, "le"));
							query.add(query.getCriterion("createTime", sTimestamp, "ge"));
						}else{
							query.add(query.getCriterion("createTime", filter.getData(), filter.getOp()));
						}
					}else if("company".equals(filter.getField())){
						query.add(query.getCriterion(filter.getField(), Integer.valueOf(filter.getData()), filter.getOp()));
					}else {
						query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
					}
				}
			}
		}
	}

}

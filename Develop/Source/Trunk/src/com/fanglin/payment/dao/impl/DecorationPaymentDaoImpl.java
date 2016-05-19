/**
 * @File Name		: DecorationPaymentDaoImpl
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  mzy
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.payment.dao.impl;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
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
	public List<DecorationPaymentPO> pageDecorationPayment(Paging paging, List<FilterVO> filters){
		PagingQuery<DecorationPaymentPO> query = pagingQuery(paging, DecorationPaymentPO.class);
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPaymentPO> queryDecorationPaymentByIds(List<Long> ids) {
		return session().createCriteria(DecorationPaymentPO.class).add(Restrictions.in("autoId", ids)).list();
	}

	@Override
	public List<DecorationPaymentPO> pageDecorationPaymentForBaseByOrderId(Paging paging, String orderId){
		PagingQuery<DecorationPaymentPO> query = pagingQuery(paging, DecorationPaymentPO.class);
		
		List<String> paymentTypes = Arrays.asList(new String[]{DecorationPaymentPO.PAYMENTTYPE_DEPOSIT_STR, DecorationPaymentPO.PAYMENTTYPE_DESIGN_STR, DecorationPaymentPO.PAYMENTTYPE_FIRST_STR, DecorationPaymentPO.PAYMENTTYPE_FIRST_SECOND_STR, DecorationPaymentPO.PAYMENTTYPE_SECOND_STR, DecorationPaymentPO.PAYMENTTYPE_FINAL_STR});

		query.add(query.getCriterion("decorationOrderPO.orderId", orderId, "eq"));
		query.add(Restrictions.in("paymentType", paymentTypes));
		query.add(Restrictions.not(Restrictions.ilike("paymentType", DecorationPaymentPO.PAYMENTTYPE_REFUND_STR, MatchMode.ANYWHERE)));
		query.asc("autoId");
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPaymentPO> queryDecorationPaymentForBaseByOrderId(String orderId){
		
		Criteria query = createCriteria(DecorationPaymentPO.class);
		
		List<String> paymentTypes = Arrays.asList(new String[]{DecorationPaymentPO.PAYMENTTYPE_DEPOSIT_STR, DecorationPaymentPO.PAYMENTTYPE_DESIGN_STR, DecorationPaymentPO.PAYMENTTYPE_FIRST_STR, DecorationPaymentPO.PAYMENTTYPE_FIRST_SECOND_STR, DecorationPaymentPO.PAYMENTTYPE_SECOND_STR, DecorationPaymentPO.PAYMENTTYPE_FINAL_STR});
		
		query.add(Restrictions.eq("decorationOrderPO.orderId", orderId));
		query.add(Restrictions.in("paymentType", paymentTypes));
		query.add(Restrictions.not(Restrictions.ilike("paymentType", DecorationPaymentPO.PAYMENTTYPE_REFUND_STR, MatchMode.ANYWHERE)));
		query.addOrder(Order.asc("autoId"));
		
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPaymentPO> queryDecorationPaymentByOrderIds(List<String> orderIds) {
		return session().createCriteria(DecorationPaymentPO.class).add(Restrictions.in("decorationOrderPO.orderId", orderIds)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPaymentPO> queryDecorationPaymentForBaseAConfirmByOrderId(String orderId){
		
		Criteria query = createCriteria(DecorationPaymentPO.class);
		
		List<String> paymentTypes = Arrays.asList(new String[]{DecorationPaymentPO.PAYMENTTYPE_DEPOSIT_STR, DecorationPaymentPO.PAYMENTTYPE_DESIGN_STR, DecorationPaymentPO.PAYMENTTYPE_FIRST_STR, DecorationPaymentPO.PAYMENTTYPE_FIRST_SECOND_STR, DecorationPaymentPO.PAYMENTTYPE_SECOND_STR, DecorationPaymentPO.PAYMENTTYPE_FINAL_STR});
		
		query.add(Restrictions.eq("decorationOrderPO.orderId", orderId));
		query.add(Restrictions.in("paymentType", paymentTypes));
		query.add(Restrictions.not(Restrictions.ilike("paymentType", DecorationPaymentPO.PAYMENTTYPE_REFUND_STR,MatchMode.ANYWHERE)));
		query.add(Restrictions.eq("paymentStatus", DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_STR));
		query.addOrder(Order.asc("autoId"));
		
		return query.list();
	}

	@Override
	public List<DecorationPaymentPO> pageDecorationPaymentForOtherByOrderId(Paging paging, String orderId){
		PagingQuery<DecorationPaymentPO> query = pagingQuery(paging, DecorationPaymentPO.class);
		
		List<String> paymentTypes = Arrays.asList(new String[]{DecorationPaymentPO.PAYMENTTYPE_ADD_STR, DecorationPaymentPO.PAYMENTTYPE_REDUCE_STR, DecorationPaymentPO.PAYMENTTYPE_PENALTY_STR});
		
		Criterion criterion = Restrictions.or(Restrictions.or(Restrictions.in("paymentType", paymentTypes), Restrictions.ilike("paymentType", DecorationPaymentPO.PAYMENTTYPE_REFUND_STR, MatchMode.ANYWHERE)), Restrictions.ilike("paymentType", DecorationPaymentPO.PAYMENTTYPE_HISTORY_STR, MatchMode.ANYWHERE));
		
		query.add(query.getCriterion("decorationOrderPO.orderId", orderId, "eq"));
		query.add(criterion);
		query.asc("autoId");
		
		return query.list();
	}

	@Override
	public List<DecorationPaymentPO> pageDecorationPaymentForCollect(Paging paging, List<FilterVO> filters){
		PagingQuery<DecorationPaymentPO> query = pagingQuery(paging, DecorationPaymentPO.class);
		
		queryFilterExcute(query, filters);
		query.asc("createTime");
		
		return query.list();
	}
	
	@Override
	public List<DecorationPaymentPO> queryDecorationPayment(List<FilterVO> filters) {
		
		PagingQuery<DecorationPaymentPO> query = pagingQuery(new Paging(), DecorationPaymentPO.class);
		
		queryFilterExcute(query, filters);
		query.notPaging();
		
		return query.list();
	}

	@Override
	public List<DecorationPaymentPO> queryDecorationPaymentForCollect(Paging paging, List<FilterVO> filters){
		
		PagingQuery<DecorationPaymentPO> query = pagingQuery(paging, DecorationPaymentPO.class);
		
		queryFilterExcute(query, filters);
		query.asc("createTime");
		
		return query.allList();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPaymentPO> queryDecorationPaymentByOrderId(String orderId){
		return session().createCriteria(DecorationPaymentPO.class).add(Restrictions.eq("decorationOrderPO.orderId", orderId)).list();
	}

	@Override
	public DecorationPaymentPO queryDecorationPaymentByOrderIdAType(	String orderId, String paymentType){
		return (DecorationPaymentPO) session().createCriteria(DecorationPaymentPO.class).add(Restrictions.eq("decorationOrderPO.orderId", orderId)).add(Restrictions.eq("paymentType", paymentType)).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPaymentPO> queryDecorationPaymentForNotInitByDrId(long drId) {
		
		List<String> paymentStatus = Arrays.asList(DecorationPaymentPO.PAYMENTSTATUS_UNSUBMIT_STR, DecorationPaymentPO.PAYMENTSTATUS_UNPAY_STR);
		
		return session().createCriteria(DecorationPaymentPO.class).createAlias("decorationReceipt", "decorationReceipt").add(Restrictions.eq("decorationReceipt.drId", drId)).add(Restrictions.not(Restrictions.in("paymentStatus", paymentStatus))).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPaymentPO> queryDecorationPaymentByReceiptId(long drId) {
		return session().createCriteria(DecorationPaymentPO.class).createAlias("decorationReceipt", "decorationReceipt").add(Restrictions.eq("decorationReceipt.drId", drId)).list();
	}

	@Override
	public int deleteDecorationPaymentForBase(String orderId){
		
		List<String> paymentTypes = Arrays.asList(new String[]{DecorationPaymentPO.PAYMENTTYPE_FIRST_STR, DecorationPaymentPO.PAYMENTTYPE_FIRST_SECOND_STR, DecorationPaymentPO.PAYMENTTYPE_SECOND_STR, DecorationPaymentPO.PAYMENTTYPE_FINAL_STR});

		String sql = "delete from platform.decorationpayment where orderId=:orderId and paymentType in :paymentTypes";
	    
	    return session().createSQLQuery(sql).setString("orderId", orderId).setParameterList("paymentTypes", paymentTypes).executeUpdate();
	}

	private void queryFilterExcute(PagingQuery<DecorationPaymentPO> query,List<FilterVO> filters){
		
		if(filters != null){
			query.alias("decorationOrderPO", "order");
			query.alias("order.customerPO", "customer");
			query.alias("order.villagePO", "village");
			query.alias("order.designerPO", "designer");
			
			for(FilterVO filter: filters){
				if(StringUtils.isNotEmpty(filter.getData())){
					if("orderId".equals(filter.getField())){
						query.add(query.getCriterion("order.orderId", filter.getData(), filter.getOp()));
					}else if("designer".equals(filter.getField())){
						query.add(query.getCriterion("designer.currentName", filter.getData(), filter.getOp()));
					}else if("customerPhone".equals(filter.getField())){
						query.add(query.getCriterion("customer.phone", filter.getData(), filter.getOp()));
					}else if("village".equals(filter.getField())){
						query.add(query.getCriterion("village.villageName", filter.getData(), filter.getOp()));
					}else if("houseNumber".equals(filter.getField())){
						query.add(query.getCriterion("order.houseNumber", filter.getData(), filter.getOp()));
					}else if("collectUser".equals(filter.getField())){
						query.alias("decorationReceipt", "decorationReceipt");
						query.alias("decorationReceipt.collectUserPO", "collectUser");
						query.add(query.getCriterion("collectUser.currentName", filter.getData(), filter.getOp()));
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
					}else {
						query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
					}
				}
			}
		}
	}
}

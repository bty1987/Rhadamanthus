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

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
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
	public List<MaterialPaymentPO> pageMaterialPayment(Paging paging, List<FilterVO> filters){
		
		PagingQuery<MaterialPaymentPO> query = pagingQuery(paging, MaterialPaymentPO.class);
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
			}
		}
		
		return query.list();
	}
	
	@Override
	public List<MaterialPaymentPO> pageMaterialPaymentBySubOrder(Paging paging, List<FilterVO> filters, List<Long> msoIds){
		
		PagingQuery<MaterialPaymentPO> query = pagingQuery(paging, MaterialPaymentPO.class);
		
		if(msoIds.size() == 0){
			return new ArrayList<MaterialPaymentPO>();
		}else{
			query.add(Restrictions.in(MaterialPaymentPO.COLUMN_MSOID_STR, msoIds));
			
			return query.list();
		}
	}

	@Override
	public List<MaterialPaymentPO> pageMaterialPaymentByMsoId(Paging paging, List<FilterVO> filters, long msoId, Integer paymentStatus){
		
		PagingQuery<MaterialPaymentPO> query = pagingQuery(paging, MaterialPaymentPO.class);
		
		query.add(query.getCriterion(MaterialPaymentPO.COLUMN_MSOID_STR, msoId, "eq"));
		
		if(paymentStatus != null){
			query.add(query.getCriterion(MaterialPaymentPO.COLUMN_PAYMENTSTATUS_STR, paymentStatus, "eq"));
		}
		
		if(filters != null){
			for(FilterVO filter: filters){
				if("orderId".equals(filter.getField())){
					continue;
				}
				query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
			}
		}
		
		return query.list();
	}
	
	@Override
	public List<MaterialPaymentPO> pageMaterialPaymentForInitByMsoIds(Paging paging, List<FilterVO> filters, List<Long> msoIds){
		
		PagingQuery<MaterialPaymentPO> query = pagingQuery(paging, MaterialPaymentPO.class);
		
		if(msoIds.size() != 0){
			query.add(Restrictions.in(MaterialPaymentPO.COLUMN_MSOID_STR, msoIds));
			query.add(query.getCriterion(MaterialPaymentPO.COLUMN_PAYMENTSTATUS_STR, MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT, "eq"));
		}else{
			return new ArrayList<MaterialPaymentPO>();
		}
		
		
		return query.list();
	}
	
	@Override
	public List<MaterialPaymentPO> pageMaterialPaymentForCollectByMsoIds(Paging paging, List<FilterVO> filters, List<Long> msoIds){

		PagingQuery<MaterialPaymentPO> query = pagingQuery(paging, MaterialPaymentPO.class);
		
		if(msoIds.size() != 0){
			query.add(Restrictions.in(MaterialPaymentPO.COLUMN_MSOID_STR, msoIds));
			query.add(query.getCriterion(MaterialPaymentPO.COLUMN_PAYMENTSTATUS_STR, MaterialPaymentPO.PAYMENTSTATUS_TYPE_COLLECT_INT, "eq"));
			
			queryFilterExcute(query, filters);
		}else{
			return new ArrayList<MaterialPaymentPO>();
		}
		
		return query.list();
	}
	
	@Override
	public List<MaterialPaymentPO> pageMaterialPaymentForConfirmByMsoIds(Paging paging, List<FilterVO> filters, List<Long> msoIds){

		PagingQuery<MaterialPaymentPO> query = pagingQuery(paging, MaterialPaymentPO.class);
		
		if(msoIds.size() != 0){
			query.add(Restrictions.in(MaterialPaymentPO.COLUMN_MSOID_STR, msoIds));
			query.add(query.getCriterion(MaterialPaymentPO.COLUMN_PAYMENTSTATUS_STR, MaterialPaymentPO.PAYMENTSTATUS_TYPE_CONFIRM_INT, "eq"));
			
			queryFilterExcute(query, filters);
		}else{
			return new ArrayList<MaterialPaymentPO>();
		}
		
		return query.list();
	}

	@Override
	public List<MaterialPaymentPO> pageMaterialPaymentForNotInitByMsoIds(Paging paging, List<FilterVO> filters, List<Long> msoIds){
		
		PagingQuery<MaterialPaymentPO> query = pagingQuery(paging, MaterialPaymentPO.class);
		
		if(msoIds.size() != 0){
			query.add(Restrictions.in(MaterialPaymentPO.COLUMN_MSOID_STR, msoIds));
			query.add(query.getCriterion(MaterialPaymentPO.COLUMN_PAYMENTSTATUS_STR, MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT, "ne"));
			
			queryFilterExcute(query, filters);
		}else{
			return new ArrayList<MaterialPaymentPO>();
		}
		
		return query.list();
	}

	@Override
	public List<MaterialPaymentPO> queryMaterialPayment(List<FilterVO> filters){
		
		PagingQuery<MaterialPaymentPO> query = pagingQuery(new Paging(), MaterialPaymentPO.class);
		
		queryFilterExcute(query, filters);
		
		query.notPaging();
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialPaymentPO> queryMaterialPaymentByMsoId(long msoId, Integer paymentStatus){
		
		Criteria query = session().createCriteria(MaterialPaymentPO.class).add(Restrictions.eq(MaterialPaymentPO.COLUMN_MSOID_STR, msoId));
		
		if(paymentStatus != null){
			query.add(Restrictions.eq(MaterialPaymentPO.COLUMN_PAYMENTSTATUS_STR, paymentStatus));
		}
		
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialPaymentPO> queryMaterialPaymentByMsoIds(List<Long> msoIds) {
		return session().createCriteria(MaterialPaymentPO.class).add(Restrictions.in(MaterialPaymentPO.COLUMN_MSOID_STR, msoIds)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialPaymentPO> queryMaterialPaymentByMsoIdAType(long msoId, Integer paymentType){
		Criteria query = session().createCriteria(MaterialPaymentPO.class).add(Restrictions.eq(MaterialPaymentPO.COLUMN_MSOID_STR, msoId));
		
		if(paymentType != null){
			query.add(Restrictions.eq(MaterialPaymentPO.COLUMN_PAYMENTTYPE_STR, paymentType));
		}
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialPaymentPO> queryMaterialPaymentByMsoIdATypeAStatus(long msoId, Integer paymentType, Integer paymentStatus) {
		
		Criteria query = session().createCriteria(MaterialPaymentPO.class).add(Restrictions.eq(MaterialPaymentPO.COLUMN_MSOID_STR, msoId));
		
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
	public List<MaterialPaymentPO> queryMaterialPaymentForNotInitByMsoId(long msoId){
		return session().createCriteria(MaterialPaymentPO.class)
				.add(Restrictions.eq(MaterialPaymentPO.COLUMN_MSOID_STR, msoId))
				.add(Restrictions.ne(MaterialPaymentPO.COLUMN_PAYMENTSTATUS_STR, MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT))
				.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialPaymentPO> queryMaterialPaymentByMpIds(List<Long> mpIds){
		return session().createCriteria(MaterialPaymentPO.class).add(Restrictions.in(MaterialPaymentPO.COLUMN_MPID_STR, mpIds)).list();
	}

	@Override
	public MaterialPaymentPO queryMaterialPaymentByMsoNoAType(String msoNo, Integer paymentType){
		return (MaterialPaymentPO) session().createCriteria(MaterialPaymentPO.class).add(Restrictions.eq(MaterialPaymentPO.COLUMN_MSONO_STR, msoNo)).add(Restrictions.eq(MaterialPaymentPO.COLUMN_PAYMENTTYPE_STR, paymentType)).uniqueResult();
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

	private void queryFilterExcute(PagingQuery<?> query, List<FilterVO> filters){
		
		query.alias("materialReceipt", "materialReceipt");
		
		if(filters != null){
			for(FilterVO filterVO: filters){
				if(MaterialPaymentPO.COLUMN_PAYMENTSTATUS_STR.equals(filterVO.getField())){
					query.add(query.getCriterion(MaterialPaymentPO.COLUMN_PAYMENTSTATUS_STR, Integer.parseInt(filterVO.getData()), filterVO.getOp()));
				}else if(MaterialPaymentPO.COLUMN_COLLECTTIME_STR.equals(filterVO.getField())){
					if("between".equals(filterVO.getOp())){
						
						String sTime = filterVO.getData().split("-")[0].replaceAll("/", "-") + " 00:00:00";
						String eTime = filterVO.getData().split("-")[1].replaceAll("/", "-") + " 23:59:59";
						
						Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
						Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");
						
						Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
						Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
						
						query.add(query.getCriterion("materialReceipt.collectTime", eTimestamp, "le"));
						query.add(query.getCriterion("materialReceipt.collectTime", sTimestamp, "ge"));
					}else{
						query.add(query.getCriterion("materialReceipt.collectTime", filterVO.getData(), filterVO.getOp()));
					}
				}
			}
		}
	}
}

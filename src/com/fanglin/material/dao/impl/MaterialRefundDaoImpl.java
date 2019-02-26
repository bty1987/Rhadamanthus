/**
 * @File Name		: MaterialRefundDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.material.dao.MaterialRefundDao;
import com.fanglin.material.po.MaterialRefundPO;
import com.fanglin.utils.Paging;

@Repository("materialRefundDao")
public class MaterialRefundDaoImpl extends DaoImpl<MaterialRefundPO> implements MaterialRefundDao {
	
	public MaterialRefundDaoImpl(){
		super(MaterialRefundPO.class);
	}

	@Override
	public List<MaterialRefundPO> pageMaterialRefundByMid(Paging paging, List<Filter> filters, long mid){
		
		PagingQuery<MaterialRefundPO> query = pagingQuery(paging, MaterialRefundPO.class);
		
		query.add(query.getCriterion(MaterialRefundPO.COLUMN_MID_STR, mid, "eq"));
		
		if(filters != null){
			for(Filter filter: filters){
				query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
			}
		}
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialRefundPO> queryMaterialRefundByMid(long mid){
		return session().createCriteria(MaterialRefundPO.class)
				.add(Restrictions.eq(MaterialRefundPO.COLUMN_MID_STR, mid))
				.add(Restrictions.ne(MaterialRefundPO.COLUMN_STATUS_STR, MaterialRefundPO.STATUS_TYPE_CANCEL_INT))
				.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialRefundPO> queryMaterialRefundByMidIdents(long mid, List<Integer> idents){
		return session().createCriteria(MaterialRefundPO.class)
				.add(Restrictions.eq(MaterialRefundPO.COLUMN_MID_STR, mid))
				.add(Restrictions.ne(MaterialRefundPO.COLUMN_STATUS_STR, MaterialRefundPO.STATUS_TYPE_CANCEL_INT))
				.add(Restrictions.in(MaterialRefundPO.COLUMN_IDENT_STR, idents))
				.list();
	}

	@Override
	public MaterialRefundPO queryMaterialRefundByMiid(long miid){
		return (MaterialRefundPO) session().createCriteria(MaterialRefundPO.class)
				.add(Restrictions.eq(MaterialRefundPO.COLUMN_MSOIID_STR, miid))
				.uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialRefundPO> queryMaterialRefundByMpId(long mpId){
		return session().createCriteria(MaterialRefundPO.class)
				.add(Restrictions.eq(MaterialRefundPO.COLUMN_MPID_STR, mpId))
				.list();
	}

	@Override
	public void updateMaterialRefundForStatusByMpId(long mpId, int status) {
		
		String sql="update material.materialrefund set status= :status where mpId= :mpId";
		
		session().createSQLQuery(sql).setLong("mpId", mpId).setInteger("status", status).executeUpdate();
		
	}

}

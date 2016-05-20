/**
 * @File Name		: MaterialSubOrderRefundDaoImpl.java
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
import com.fanglin.core.vo.FilterVO;
import com.fanglin.material.dao.MaterialSubOrderRefundDao;
import com.fanglin.material.po.MaterialSubOrderRefundPO;
import com.fanglin.utils.Paging;

@Repository("materialSubOrderRefundDao")
public class MaterialSubOrderRefundDaoImpl extends DaoImpl<MaterialSubOrderRefundPO> implements MaterialSubOrderRefundDao {
	
	public MaterialSubOrderRefundDaoImpl(){
		super(MaterialSubOrderRefundPO.class);
	}

	@Override
	public List<MaterialSubOrderRefundPO> pageMaterialSubOrderRefundByMsoId(Paging paging, List<FilterVO> filters, long msoId){
		
		PagingQuery<MaterialSubOrderRefundPO> query = pagingQuery(paging, MaterialSubOrderRefundPO.class);
		
		query.add(query.getCriterion(MaterialSubOrderRefundPO.COLUMN_MSOID_STR, msoId, "eq"));
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
			}
		}
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialSubOrderRefundPO> queryMaterialSubOrderRefundByMsoId(long msoId){
		return session().createCriteria(MaterialSubOrderRefundPO.class)
				.add(Restrictions.eq(MaterialSubOrderRefundPO.COLUMN_MSOID_STR, msoId))
				.add(Restrictions.ne(MaterialSubOrderRefundPO.COLUMN_STATUS_STR, MaterialSubOrderRefundPO.STATUS_TYPE_CANCEL_INT))
				.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialSubOrderRefundPO> queryMaterialSubOrderRefundByMsoIdIdents(long msoId, List<Integer> idents){
		return session().createCriteria(MaterialSubOrderRefundPO.class)
				.add(Restrictions.eq(MaterialSubOrderRefundPO.COLUMN_MSOID_STR, msoId))
				.add(Restrictions.ne(MaterialSubOrderRefundPO.COLUMN_STATUS_STR, MaterialSubOrderRefundPO.STATUS_TYPE_CANCEL_INT))
				.add(Restrictions.in(MaterialSubOrderRefundPO.COLUMN_IDENT_STR, idents))
				.list();
	}

	@Override
	public MaterialSubOrderRefundPO queryMaterialSubOrderRefundByMsoiId(long msoiId){
		return (MaterialSubOrderRefundPO) session().createCriteria(MaterialSubOrderRefundPO.class)
				.add(Restrictions.eq(MaterialSubOrderRefundPO.COLUMN_MSOIID_STR, msoiId))
				.uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<MaterialSubOrderRefundPO> queryMaterialSubOrderRefundByMpId(long mpId){
		return session().createCriteria(MaterialSubOrderRefundPO.class)
				.add(Restrictions.eq(MaterialSubOrderRefundPO.COLUMN_MPID_STR, mpId))
				.list();
	}

}

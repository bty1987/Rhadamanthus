/**
 * @File Name		: AddOrReduceDetailDaoImpl
 * @Package   	: com.fanglin.dao.impl.decorationOrder
 * @Version		: 1.0
 * @Date			: 2014-10-02
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.decoration.dao.AddOrReduceDetailDao;
import com.fanglin.decoration.po.AddOrReduceDetailPO;
import com.fanglin.utils.Paging;

@Repository("addOrReduceDetailDao")
public class AddOrReduceDetailDaoImpl extends DaoImpl<AddOrReduceDetailPO> implements AddOrReduceDetailDao {
	
	public AddOrReduceDetailDaoImpl(){
		super(AddOrReduceDetailPO.class);
	}
	
	@Override
	public List<AddOrReduceDetailPO> pageAddOrReduceDetail(Paging paging, List<FilterVO> filters){
		PagingQuery<AddOrReduceDetailPO> query = pagingQuery(paging, AddOrReduceDetailPO.class);
		
		if(filters != null){
			for(FilterVO filter: filters){
				if("addOrReduceId".equals(filter.getField())){
					query.add(query.getCriterion("arId",Integer.parseInt((filter.getData())), filter.getOp()));
				}else {
					query.add(query.getCriterion(filter.getField(),(filter.getData()), filter.getOp()));
				}
			}
		}
		
		query.asc("itemId");
		query.asc("itemType");
		query.asc("customerItemId");
		
		return query.list();
	}

	@Override
	public List<AddOrReduceDetailPO> pageAddOrReduceDetailById(Paging paging, List<FilterVO> filters, int arId){
		
		PagingQuery<AddOrReduceDetailPO> query = pagingQuery(paging, AddOrReduceDetailPO.class);
		
		query.add(Restrictions.eq("arId", arId));
		
		if(filters != null){
			for(FilterVO filter: filters){
				query.add(query.getCriterion(filter.getField(), filter));
			}
		}
		
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<AddOrReduceDetailPO> queryAddOrReduceDetailById(int addOrReduceId){
		return createCriteria(AddOrReduceDetailPO.class).add(Restrictions.eq("arId", addOrReduceId)).addOrder(Order.asc("itemId")).list();
	}

	@Override
	public int deleteAddOrReduceDetailById(int addOrReduceId){
		String sqlUpdate = "delete from platform.addorreducedetail where arId = :arId";
		int deletedEntities = session().createSQLQuery( sqlUpdate ).setInteger("arId", addOrReduceId ).executeUpdate();
		
		return deletedEntities;
	}

}

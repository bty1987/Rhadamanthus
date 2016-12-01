/**
 * @File Name		: DecorationContractDaoImpl
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationContractDao;
import com.fanglin.decoration.po.DecorationContractPO;
import com.fanglin.utils.Paging;

@Repository("decorationContractDao")
public class DecorationContractDaoImpl extends DaoImpl<DecorationContractPO> implements DecorationContractDao {

	public DecorationContractDaoImpl(){
		super(DecorationContractPO.class);
	}
	
	@Override
	public List<DecorationContractPO> pageDecorationContract(Paging paging, List<Filter> filters){
		PagingQuery<DecorationContractPO> query = pagingQuery(paging, DecorationContractPO.class);
		if(filters != null){

			for(Filter filter : filters){
				if("orderId".equals(filter.getField())){
					query.add(query.getCriterion("decorationOrderPO.orderId",(filter.getData()), filter.getOp()));
				}else{
					query.add(query.getCriterion(filter.getField(),(filter.getData()), filter.getOp()));
				}
			}
		}
		
		return query.list();
	}
	
	@Override
	public DecorationContractPO queryDecorationContractByOrderId(String orderId){
		return (DecorationContractPO) createCriteria(DecorationContractPO.class).add(Restrictions.eq("decorationOrderPO.orderId", orderId)).uniqueResult();
	}
}

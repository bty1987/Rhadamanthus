package com.fanglin.store.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.dao.CartDao;
import com.fanglin.store.po.CartPO;
import com.fanglin.utils.Paging;

@Repository("cartDao")
public class CartDaoImpl extends DaoImpl<CartPO> implements CartDao{

	public CartDaoImpl(){
		super(CartPO.class);
	}
	
	@Override
	public List<CartPO> pageCart(Paging paging, List<Filter> filters) {
		
		PagingQuery<CartPO> query = pagingQuery(paging, CartPO.class);
		
		if(filters != null){
			for (Filter filter : filters) {
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				if(field.equals("uid")){
					query.add(query.getCriterion(field, Long.valueOf(data), op)).desc("cid");
				}
			}
		}
		
		return query.list();
		
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<CartPO> queryCartByUid(long uid) {
		return session().createCriteria(CartPO.class).add(Restrictions.eq(CartPO.COLUMN_UID_STR, uid)).list();
	}

	@Override
	public void clearCart(List<Long> cids) {
		
		String sql = "delete from store.cart where cid in (:cids)";
		
		session().createSQLQuery(sql).setParameterList("cids", cids).executeUpdate();
			
	}

}

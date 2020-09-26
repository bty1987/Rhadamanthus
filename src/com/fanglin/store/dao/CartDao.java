package com.fanglin.store.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.po.CartPO;
import com.fanglin.utils.Paging;

public interface CartDao extends Dao<CartPO> {

	public List<CartPO> pageCart(Paging paging, List<Filter> filters);

	public List<CartPO> queryCartByUid(long uid);

	public int clearCart(List<Long> cids);

}

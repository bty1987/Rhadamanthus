package com.fanglin.store.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.po.CouponPO;
import com.fanglin.utils.Paging;

public interface CouponDao extends Dao<CouponPO> {

	public List<CouponPO> pageCoupon(Paging paging, List<Filter> filters);

}

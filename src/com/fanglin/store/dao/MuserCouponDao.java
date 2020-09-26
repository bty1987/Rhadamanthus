package com.fanglin.store.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.po.MuserCouponPO;
import com.fanglin.utils.Paging;

public interface MuserCouponDao extends Dao<MuserCouponPO> {

	public List<MuserCouponPO> pageMuserCoupon(Paging paging, List<Filter> filters);

	public List<MuserCouponPO> queryMuserCouponByUnionId(String unionId);

	public int updateMuserCouponByCid(long cid);
}

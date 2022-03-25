package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.po.DecorationPicturePO;
import com.fanglin.utils.Paging;

public interface DecorationPictureDao extends Dao<DecorationPicturePO> {

	public List<DecorationPicturePO> queryCusDecorationPicture(Paging paging, List<Filter> filters, String orderId);

}
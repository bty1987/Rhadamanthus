package com.fanglin.log.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.log.po.DecorationPictureLogPO;
import com.fanglin.utils.Paging;

public interface DecorationPictureLogDao extends Dao<DecorationPictureLogPO> {

	List<DecorationPictureLogPO> pageDecorationPictureLog(Paging paging, List<Filter> filters);

}

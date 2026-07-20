package com.fanglin.log.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.log.po.KingdeeSyncLogPO;
import com.fanglin.utils.Paging;

public interface KingdeeSyncLogDao extends Dao<KingdeeSyncLogPO> {

	List<KingdeeSyncLogPO> pageKingdeeSyncLog(Paging paging, List<Filter> filters);

}

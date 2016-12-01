/**
 * Title: NoticeDao
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 */

package com.fanglin.information.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.po.NoticePO;
import com.fanglin.utils.Paging;

public interface NoticeDao extends Dao<NoticePO> {
	
	public List<NoticePO> queryPageNotices(Paging paging, List<Filter> filters, String userId);
	
	public List<NoticePO> queryPageDeptValidNotices(Paging paging, List<String> deptIds, String type);
	
	public List<NoticePO> queryValidNotices(String type);
	
}

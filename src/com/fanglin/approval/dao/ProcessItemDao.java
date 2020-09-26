/**
 * Title: ApproverDao
 * Description:
 * Copyright: Copyright (c) 2014 All rights reserved.
 * Company: 
 * @author bty1987
 *
 */

package com.fanglin.approval.dao;

import java.util.List;

import com.fanglin.approval.po.ProcessItemPO;
import com.fanglin.core.dao.Dao;

public interface ProcessItemDao extends Dao<ProcessItemPO> {

	public List<ProcessItemPO> queryProcessItem(Long pid);

	public void deleteProcessItem(Long pid);
}

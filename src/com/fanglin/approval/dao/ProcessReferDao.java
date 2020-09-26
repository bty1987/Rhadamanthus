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

import com.fanglin.approval.po.ProcessReferPO;
import com.fanglin.core.dao.Dao;

public interface ProcessReferDao extends Dao<ProcessReferPO> {

	public List<ProcessReferPO> queryProcessRefer();
}

package com.fanglin.dingding.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.dingding.po.DingTalkApprovalConfigPO;

public interface DingTalkApprovalConfigDao extends Dao<DingTalkApprovalConfigPO> {

	public DingTalkApprovalConfigPO queryByProcessCode(String processCode);

	public List<String> queryEnabledGenericProcessCodes();

}

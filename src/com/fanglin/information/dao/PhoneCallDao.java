package com.fanglin.information.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.po.PhoneCallPO;
import com.fanglin.utils.Paging;

public interface PhoneCallDao extends Dao<PhoneCallPO> {

	public List<PhoneCallPO> pagePhoneCall(Paging paging, List<Filter> filters);

	public PhoneCallPO queryPhoneCallByCallBackId(String callBackId);

	public PhoneCallPO queryPhoneCallByCallerACallee(String caller, String callee);

}

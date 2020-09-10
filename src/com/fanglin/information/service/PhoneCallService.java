package com.fanglin.information.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.vo.PhoneCallVO;
import com.fanglin.utils.Paging;

public interface PhoneCallService {

	public void pagePhoneCall(Paging paging, List<Filter> filters) throws FLException;

	public int phoneCall(PhoneCallVO phoneCall) throws FLException;

	public int updatePhoneCallForInfo(PhoneCallVO phoneCall) throws FLException;

	public int updatePhoneCallForRecord(PhoneCallVO phoneCall) throws FLException;

}

package com.fanglin.personel.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.Paging;

public interface WorkerService {

	public void pageWorker(Paging paging, List<Filter> filters, int company) throws FLException;

	public void addWorker(UserVO workerVO, String userId, int company) throws FLException;

	public void updateWorker(UserVO workerVO) throws FLException;

}

package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.SignetVO;
import com.fanglin.utils.Paging;

public interface SignetService {

	public void pageSignet(Paging paging, List<Filter> filters, int company);

	public List<SignetVO> querySignet(int company);

	public int addSignet(SignetVO signet, int company) throws FLException;

	public int updateSignet(SignetVO signetVO) throws FLException;

	public int registSignet(SignetVO signetVO) throws FLException;

	public String authSignet(SignetVO signetVO) throws FLException;

	public int confirmSignet(SignetVO signetVO) throws FLException;

	public int signateSignet(SignetVO signetVO) throws FLException;

	public String autoSignet(SignetVO signetVO) throws FLException;

	public int cancelSignet(SignetVO signetVO) throws FLException;

}

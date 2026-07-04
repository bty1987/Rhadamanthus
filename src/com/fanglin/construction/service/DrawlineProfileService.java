package com.fanglin.construction.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.construction.vo.DrawlineProfileVO;
import com.fanglin.utils.Paging;

public interface DrawlineProfileService {

	public void pageDrawlineProfile(Paging paging, List<Filter> filters, int company);

	public List<DrawlineProfileVO> queryDrawlineProfileByDlid(DrawlineProfileVO drawlineProfileVO) throws FLException;

	public List<DrawlineProfileVO> queryDrawlineProfileByOrderId(DrawlineProfileVO drawlineProfileVO) throws FLException;

	public DrawlineProfileVO queryDrawlineProfileByDpid(DrawlineProfileVO drawlineProfileVO) throws FLException;

	public int addDrawlineProfile(DrawlineProfileVO drawlineProfileVO, String userId, int company) throws FLException;

	public int makeDrawlineProfile(DrawlineProfileVO drawlineProfileVO, String userId, int company) throws FLException;

	public void handleDrawlineProfile(DrawlineProfileVO drawlineProfileVO) throws FLException;

}

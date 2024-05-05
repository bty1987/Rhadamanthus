package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.vo.OccessoriesItemVO;
import com.fanglin.inventory.vo.OccessoriesVO;
import com.fanglin.utils.Paging;

public interface OccessoriesService {

	public void pageOccessories(Paging paging, List<Filter> filters, int company, OccessoriesVO occessories);

	public void pageOccessoriesForSupplier(Paging paging, List<Filter> filters, String userId, OccessoriesVO occessoriesVO);

	public List<OccessoriesVO> queryOccessoriesByOrderId(OccessoriesVO occessories);

	public OccessoriesVO queryOccessoriesByOid(OccessoriesVO occessoriesVO);

	public int addOccessories(OccessoriesVO occessoriesVO, List<OccessoriesItemVO> OccessoriesItemVOs, String userId) throws FLException;

	public int bindOccessories(OccessoriesVO occessoriesVO) throws FLException;

	public int deliveOccessories(OccessoriesVO occessoriesVO, List<OccessoriesItemVO> OccessoriesItemVOs, String userId) throws FLException;

	public int receiveOccessories(OccessoriesVO occessoriesVO, List<OccessoriesItemVO> OccessoriesItemVOs, String userId) throws FLException;

	public int balanceOccessories(OccessoriesVO occessoriesVO, List<OccessoriesItemVO> OccessoriesItemVOs, String userId) throws FLException;

	public int finishOccessories(OccessoriesVO occessories) throws FLException;

	public int rateOccessories(OccessoriesVO occessories);

	public int deleteOccessories(OccessoriesVO occessoriesVO) throws FLException;

}

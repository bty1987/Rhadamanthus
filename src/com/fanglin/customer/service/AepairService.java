package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.AepairVO;
import com.fanglin.customer.vo.ConsultionVO;
import com.fanglin.utils.Paging;

public interface AepairService {

	public void pageAepair(Paging paging, List<Filter> filters, int company);

	public List<AepairVO> queryAepair(AepairVO aepairVO);

	public List<AepairVO> queryAepairByOrderId(AepairVO aepairVO);

	public int addAepair(AepairVO aepairVO, ConsultionVO consultionVO, String userId, int company) throws FLException;

	public int updateAepair(AepairVO aepairVO, String userId) throws FLException;

	public int receiveAepair(AepairVO aepairVO, String userId) throws FLException;

	public int deliveAepair(AepairVO aepairVO, String userId) throws FLException;

	public int tranAepair(AepairVO aepairVO, String userId) throws FLException;

	public int finishAepair(AepairVO aepairVO, String userId) throws FLException;

	public int closeAepair(AepairVO aepairVO, String userId) throws FLException;

	public int sendAepair(String code, AepairVO aepairVO);

}

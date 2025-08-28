package com.fanglin.market.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.market.vo.CnoticeVO;

public interface CnoticeService {

	public List<CnoticeVO> queryCnoticeByUid(CnoticeVO cnotice, short type);

	public int countCnotice(CnoticeVO cnotice, short type);

	public void addCnotice(CnoticeVO cnotice, String unionId) throws FLException;

	public void deleteCnotice(CnoticeVO cnotice) throws FLException;

	public void updateCnoticeForStatus(CnoticeVO cnotice) throws FLException;

}

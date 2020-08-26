package com.fanglin.data.common.service;

import java.util.List;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.DecorationMatchingVO;

public interface DecorationMatchingService {

	public List<DecorationMatchingVO> queryDecorationMatching(List<Short> type, List<Short> typeness, int company) throws FLException;

	public void addDecorationMatching(DecorationMatchingVO decorationMatchingVO, int company) throws FLException;

	public void updateDecorationMatching(DecorationMatchingVO decorationMatchingVO, int company) throws FLException;

}

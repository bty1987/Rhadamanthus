package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.NormtimeItemPO;

public interface NormtimeItemDao extends Dao<NormtimeItemPO> {

	public List<NormtimeItemPO> queryNormtimeItem(long qid);

	public NormtimeItemPO queryNormtimeItem(long sid, long quoteId, long ntid, short type);

	public int amountNormtimeItem(long qid, long cnid);

	public int disabledNormtimeItem(long qid);

	public int disabledNormtimeItem(long qid, short type);

	public int disabledNormtimeItem(long qid, long sid, short type);

	public int disabledNormtimeItem(long qid, long sid, long quoteId, short type);

	public int deleteNormtimeItem(long qid, short type);

	public int deleteNormtimeItem(long qid, short type, short status);

	public int deleteNormtimeItem(long qid, long sid, short type);

}

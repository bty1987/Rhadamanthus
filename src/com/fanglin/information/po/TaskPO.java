package com.fanglin.information.po;

import static javax.persistence.GenerationType.IDENTITY;
import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "task",catalog = "information")

public class TaskPO implements Serializable{
	
	private static final long serialVersionUID = -5885986511194210020L;
    
    public static final String COLUMN_NAME_STR = "name";
  
    public static final String COLUMN_STATUS_STR = "status";
    
	public static final short TYPE_PYTHON_INT = 0;
	
	public static final short TYPE_SHELL_INT = 1;
	
	public static final Short STATUS_ENABLE_INT = 0;
	
	private long tid;
	
	private String name;
	
	private String filepath;
	
	private short type;
	
	private String content;
	
	private short status;

	public TaskPO(){
		super();
	}
    
	public TaskPO(long tid){
		super();
		this.tid = tid;
	}
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "tid")
	public long getTid() {
		return tid;
	}
	
	public void setTid(long tid) {
		this.tid = tid;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "filepath")
	public String getFilepath() {
		return filepath;
	}

	public void setFilepath(String filepath) {
		this.filepath = filepath;
	}
	
	@Column(name = "type")
	public void setType(short type) {
		this.type = type;
	}

	public short getType() {
		return type;
	}
	
	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	
}
